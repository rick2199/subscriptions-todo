import { useReactSupabaseClient } from "@/hooks/useReactSupabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface TodoContextValue {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setTodoCategories: Dispatch<SetStateAction<any[] | null>>;
  todoCategories: any[] | null;
}

export const TodoContext = createContext<TodoContextValue>({
  isModalOpen: false,
  setModalOpen: () => null,
  setTodoCategories: () => null,
  todoCategories: [],
});

const TodoProvider = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const { supabase } = useReactSupabaseClient();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [todoCategories, setTodoCategories] = useState<
    { category: string | null }[] | null
  >([]);

  useEffect(() => {
    const fetchTodosCategoriesByUser = async () => {
      const { data } = await supabase
        .from("todo_categories")
        .select("category")
        .eq("user_id", user?.id);
      setTodoCategories(data?.map((item) => item.category) as []);
    };
    if (user?.id) {
      fetchTodosCategoriesByUser();
    }
  }, [supabase, user?.id]);

  return (
    <TodoContext.Provider
      value={{
        isModalOpen,
        setModalOpen,
        todoCategories,
        setTodoCategories,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
