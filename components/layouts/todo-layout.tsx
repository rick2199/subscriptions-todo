import Image from "next/image";
import { Dispatch, SetStateAction, useContext } from "react";
import { Heading } from "@/components/atoms/heading";
import { TodoContext } from "@/context/todo-context";
import { Loader } from "../atoms/loader";

interface Props {
  title: string;
  children: React.ReactNode;
  setOpenSearch: Dispatch<SetStateAction<boolean>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  isSearchOpen: boolean;
  searchQuery: string;
  searchLoading: boolean;
}

const TodoLayout: React.FC<Props> = ({
  title,
  children,
  setOpenSearch,
  isSearchOpen,
  searchQuery,
  searchLoading,
  setSearchQuery,
}) => {
  const { setModalOpen } = useContext(TodoContext);

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <div className="flex w-full">
        <Heading as="h1" size="xl" className="mr-auto">
          {title}
        </Heading>
        <div className="flex flex-row gap-4 ml-auto">
          <button onClick={() => setOpenSearch(!isSearchOpen)}>
            {isSearchOpen ? (
              <Image
                src="/icons/closed-search-icon.svg"
                alt="search-icon"
                height={26}
                width={26}
              />
            ) : (
              <Image
                src="/icons/search-icon.svg"
                alt="search-icon"
                height={26}
                width={26}
              />
            )}
          </button>
          <button onClick={() => setModalOpen(true)}>
            <Image
              src="/icons/plus-icon.svg"
              alt="plus-icon"
              height={26}
              width={26}
            />
          </button>
        </div>
      </div>
      {isSearchOpen && (
        <div className="relative">
          <input
            type={"text"}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-100 px-4 py-2 rounded-md border-2 border-primary-dark w-full"
            value={searchQuery}
            placeholder="Search for your todo"
          />
          {searchLoading && (
            <div className="absolute right-0 top-[6px]">
              <Loader />
            </div>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
export default TodoLayout;
