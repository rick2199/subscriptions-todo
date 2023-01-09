import { useState } from "react";
import { Tab } from "@headlessui/react";
import { TodoItem } from "../todo-item";
import { Heading } from "@/components/atoms/heading";

interface Props {
  todos: any[];
}

const TodoTab: React.FC<Props> = ({ todos }) => {
  const completedTodos = todos?.filter((todo) => todo.completed);
  const incompletedTodos = todos?.filter((todo) => !todo.completed);
  const [allTodos] = useState({
    "Unfinished Tasks": incompletedTodos,
    "Completed Tasks": completedTodos,
  });

  return (
    <div className="w-full max-w-lg sm:px-0">
      <Tab.Group>
        <Tab.List className="flex gap-1 rounded-xl bg-primary-light p-1">
          {Object.keys(allTodos).map((todos) => (
            <Tab
              key={todos}
              className={({ selected }) =>
                `w-full rounded-lg py-4 px-1 text-sm font-medium leading-5 text-blue-700ring-white ring-opacity-60  ${
                  selected
                    ? "bg-primary-dark shadow text-white "
                    : "text-primary-dark bg-white"
                }`
              }
            >
              {todos}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(allTodos).map((todos, idx) => (
            <Tab.Panel
              key={idx}
              className={
                "rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              }
            >
              {todos?.length ? (
                todos?.map((item: any) => {
                  return (
                    <TodoItem
                      key={item.id}
                      id={item.id}
                      completed={item.completed}
                      category={item.category}
                      title={item.todo as string}
                    />
                  );
                })
              ) : (
                <div className="text-left">
                  <Heading>Not found todos in this section</Heading>
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TodoTab;
