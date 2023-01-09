import { TodoContext } from "@/context/todo-context";
import { ErrorMessage as FormikErrorMessage } from "formik";
import Link from "next/link";
import { useContext } from "react";

interface Props {
  error: string;
  name: string;
}

const ErrorMessage: React.FC<Props> = ({ error, name }) => {
  const { setModalOpen } = useContext(TodoContext);
  return (
    <>
      {error && (
        <FormikErrorMessage
          name={name}
          component={() => (
            <div
              className={`relative top-2 text-sm p-1 border-[#FB2834] border rounded-md bg-white text-[#FB2834] `}
            >
              <p>
                {error}
                {error === "You need to be premium to keep adding todos. " && (
                  <span>
                    <Link
                      href={"/pricing"}
                      className="underline"
                      onClick={() => setModalOpen(false)}
                    >
                      Go to pricing
                    </Link>
                  </span>
                )}
              </p>
            </div>
          )}
        />
      )}
    </>
  );
};
export default ErrorMessage;
