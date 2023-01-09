import { TodoContext } from "@/context/todo-context";
import { Users } from "@/utils/database.types";
import { useContext } from "react";
import { TodoModal } from "../organisms/modals";
import NavBar from "../organisms/nav-bar/nav-bar";

interface Props {
  children: React.ReactNode;
  user: Users | null;
}

const Layout: React.FC<Props> = ({ children, user }) => {
  const { isModalOpen, setModalOpen } = useContext(TodoContext);
  return (
    <>
      <TodoModal
        user={user}
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />
      <div className="h-full w-full">
        <header className="md:mb-20 mb-10">
          <NavBar user={user} />
        </header>
        <main className="h-full px-4 md:px-0">{children}</main>
      </div>
    </>
  );
};

export default Layout;
