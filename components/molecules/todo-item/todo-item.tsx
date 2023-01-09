import { TodoContext } from "@/context/todo-context";
import { useReactSupabaseClient } from "@/hooks/useReactSupabaseClient";
import Link from "next/link";
import { useContext } from "react";
import { Dropdown } from "../dropdown";

interface Props {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

const TodoItem: React.FC<Props> = ({ category, title, id, completed }) => {
  const { supabase } = useReactSupabaseClient();

  const handleTodoDone = async (id: string) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: true, finished_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }
  };
  const handleTodoDelete = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.log(error);
      return;
    }
  };

  const dropdownItems = [
    !completed
      ? {
          handleClick: () => handleTodoDone(id),
          title: "Done",
        }
      : undefined,
    {
      handleClick: () => handleTodoDelete(id),
      title: "Delete",
    },
  ];

  const filteredDropdownItems = dropdownItems.filter(
    (item) => item !== undefined
  );
  return (
    <div className="flex gap-2  items-start justify-between mb-10 ">
      <div className="relative font-body  text-left">
        <p className="text-lg">{title}</p>
        <Link
          href={`/category/${category.toLowerCase()}`}
          className="font-heading text-sm text-gray-400 hover:underline"
        >
          {category}
        </Link>
      </div>
      <Dropdown title="..." dropdownItems={filteredDropdownItems} />
    </div>
  );
};

export default TodoItem;
