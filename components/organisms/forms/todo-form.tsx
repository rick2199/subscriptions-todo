import { useContext, useState } from "react";
import { Form, Formik } from "formik";
import Image from "next/image";
import { ComboBox } from "@/components/molecules/combobox";
import { Heading } from "@/components/atoms/heading/";
import { TextField } from "@/components/molecules/form-fields";
import { ErrorMessage } from "@/components/atoms/error-message";
import { RadioGroups } from "@/components/molecules/radio-group";
import { useReactSupabaseClient } from "@/hooks/useReactSupabaseClient";
import { TodoPriority, Users } from "@/utils/database.types";
import { TodoContext } from "@/context/todo-context";
import { Loader } from "@/components/atoms/loader";
import axios from "axios";
import { useMachine } from "@xstate/react";
import todoMachine from "@/machines/todos-machine";
import { Todo } from "@/machines/todos-machine";

interface Props {
  user: Users | null;
}

const priorities = ["Low", "Medium", "High"];

const saveTodo = ({ todo }: { todo: Todo | null }) => {};

const TodoForm: React.FC<Props> = ({ user }) => {
  const [selectedPriority, setSelectedPriority] = useState(priorities[0]);
  const [selectedCategory, setSelectedCategory] = useState<any>("");
  const { setModalOpen, setTodoCategories, todoCategories } =
    useContext(TodoContext);
  const { supabase } = useReactSupabaseClient();
  const [isLoading, setLoading] = useState<boolean>(false);

  const [state, send] = useMachine(todoMachine, {
    services: {
      saveTodo: async (context, event) => {
        return saveTodo({ todo: context?.createNewTodo });
      },
    },
  });

  return (
    <Formik
      initialValues={{
        task: "",
        priority: "",
        category: "",
      }}
      validate={({ task }) => {
        const errors: any = {};
        if (!task) {
          errors.task = "Please write a task";
        }
        if (!selectedPriority) {
          errors.priority = "Please choose your task's priority";
        }
        if (!selectedCategory) {
          errors.category = "Please choose a category";
        }

        return errors;
      }}
      onSubmit={async (
        { category, task, priority },
        { setErrors, resetForm }
      ) => {
        setLoading(true);
        category = selectedCategory;
        priority = selectedPriority;
        if (user?.plan === "free") {
          const { data: limitAction } = await axios({
            url: `/api/user-actions?userId=${user?.id}`,
            method: "GET",
          });

          if (limitAction) {
            setErrors({
              task: "You need to be premium to keep adding todos. ",
            });
            setLoading(false);
            return;
          }
        }

        const { data: dbCategory } = await supabase
          .from("todo_categories")
          .select("*")
          .eq("category", category)
          .single();

        if (!dbCategory?.category) {
          const { error: savedCategoryError } = await supabase
            .from("todo_categories")
            .insert({ category, user_id: user?.id });

          if (savedCategoryError) {
            setErrors({ category: "Error saving your category" });
            return;
          }

          setTodoCategories((prev: any) => [...prev, category]);

          const { data: savedCategory } = await supabase
            .from("todo_categories")
            .select("id")
            .eq("category", category)
            .single();

          const todoData = {
            category_id: savedCategory?.id as string,
            user_id: user?.id,
            todo: task,
            priority: priority.toLowerCase() as TodoPriority,
            started_at: new Date().toISOString(),
          };

          const { error } = await supabase
            .from("todos")
            .insert({ ...todoData });

          if (error) {
            setErrors({ category: "Error saving your task" });
            return;
          }
          setLoading(false);
          resetForm();
          setModalOpen(false);
          if (user?.plan === "free") {
            await axios({
              url: "/api/user-actions",
              data: { userId: user?.id, actionType: "Create Task" },
              method: "POST",
            });
          }
          return;
        }

        const todoData = {
          category_id: dbCategory?.id,
          user_id: user?.id,
          todo: task,
          priority: priority.toLowerCase() as TodoPriority,
          started_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("todos").insert({ ...todoData });
        if (error) {
          setErrors({ task: error.message });
          return;
        }
        setLoading(false);
        resetForm();
        setModalOpen(false);
        if (user?.plan === "free") {
          await axios({
            url: "/api/user-actions",
            data: { userId: user?.id, actionType: "Create Task" },
            method: "POST",
          });
        }
      }}
    >
      {({ errors, touched }) => {
        return (
          <Form className="flex flex-col gap-8 !text-primary-dark">
            <div className="flex flex-row justify-between items-end">
              <div className="w-full relative">
                <div className="flex flex-row justify-between gap-8">
                  <TextField
                    error={errors.task as string}
                    touched={touched.task as boolean}
                    type="text"
                    name="task"
                    label="Add your task"
                    placeholder="Here add your task"
                  />
                  {!isLoading ? (
                    <button type="submit" className={`relative top-2 right-0`}>
                      <Image
                        src="/icons/plus-icon.svg"
                        alt="plus-icon"
                        height={26}
                        width={26}
                      />
                    </button>
                  ) : (
                    <div className={`relative top-7 h-fit right-0`}>
                      <Loader />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:gap-8">
              <div className="my-4 flex flex-col gap-2 md:order-2">
                <Heading size="sm">Mark your priority</Heading>
                <div>
                  <RadioGroups
                    fieldName="priority"
                    selected={selectedPriority}
                    setSelected={setSelectedPriority}
                  />
                  {touched.priority && (
                    <ErrorMessage
                      error={errors.priority as string}
                      name="priority"
                    />
                  )}
                </div>
              </div>
              <div className="my-4">
                <label className="flex flex-col ">
                  <Heading size="sm" className="mb-3">
                    Choose a category
                  </Heading>
                </label>
                <ComboBox
                  touched={touched.category as boolean}
                  error={errors.category as string}
                  fieldName="category"
                  values={todoCategories as any[]}
                  selected={selectedCategory}
                  setSelected={setSelectedCategory}
                />
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TodoForm;
