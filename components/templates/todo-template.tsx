import { Users } from "@/utils/database.types";
import axios from "axios";
import { useEffect, useState } from "react";
import { TodoLayout } from "@/components/layouts";
import TodoTab from "@/components/molecules/tabs/todo-tab";
import { TodoItem } from "@/components/molecules/todo-item";
import { Heading } from "../atoms/heading";

interface Props {
  todos: any;
  user: Users;
}

const TodoTemplate: React.FC<Props> = ({ todos, user }) => {
  const [isSearchOpen, setOpenSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fetchedSearchTodos, setFetchedSearchTodos] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleSearch = async ({ searchQuery }: { searchQuery: string }) => {
      setSearchLoading(true);
      try {
        const { data } = await axios({
          url: `/api/search?userId=${user.id}&search=${searchQuery}`,
          method: "GET",
        });
        setFetchedSearchTodos(data.fetchedTodos);
      } catch (error) {
        console.log({ error });
      } finally {
        setSearchLoading(false);
      }
    };
    if (searchQuery.length > 3) {
      handleSearch({ searchQuery });
    }
    if (searchQuery.length < 3) {
      setFetchedSearchTodos([]);
    }
    if (!isSearchOpen) {
      setSearchQuery("");
      setFetchedSearchTodos([]);
    }
  }, [searchQuery, user?.id, isSearchOpen]);

  return (
    <TodoLayout
      title="Todo list"
      isSearchOpen={isSearchOpen}
      searchQuery={searchQuery}
      setOpenSearch={setOpenSearch}
      setSearchQuery={setSearchQuery}
      searchLoading={searchLoading}
    >
      {fetchedSearchTodos.length ? (
        fetchedSearchTodos.map((fetchedTodo) => (
          <TodoItem
            category={fetchedTodo.category}
            completed={fetchedTodo.completed}
            title={fetchedTodo.todo}
            id={fetchedTodo.id}
            key={fetchedTodo.id}
          />
        ))
      ) : searchQuery.length > 3 ? (
        searchLoading ? (
          <></>
        ) : (
          <Heading>Not Found</Heading>
        )
      ) : (
        <TodoTab todos={todos} />
      )}
    </TodoLayout>
  );
};

export default TodoTemplate;
