import { useMachine } from "@xstate/react";

import { todosMachine } from "@/machines/todo-machine";
import { Heading } from "./atoms/heading";

const todos = new Set<string>([]);

const Todo = () => {
  const [state, send] = useMachine(todosMachine, {
    services: {
      loadTodos: async () => {
        return Array.from(todos);
      },
      saveTodo: async (context, event) => {
        todos.add(context.createNewTodoFormInput);
      },
      deleteTodo: async (context, event) => {
        todos.delete(event.todo);
      },
    },
  });

  return (
    <div>
      <div>
        {state.matches("Todos Loaded") && (
          <>
            {state.context.todos.map((todo) => (
              <div
                key={todo}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p>{todo}</p>
                <button
                  onClick={() => {
                    send({
                      type: "Delete",
                      todo,
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
        {state.matches("Todos Loaded") && (
          <button
            onClick={() => {
              send({
                type: "Create new",
              });
            }}
          >
            Create new
          </button>
        )}
        {state.matches("Deleting todo errored") && (
          <>
            <p>Something went wrong: {state.context.errorMessage}</p>
            <button
              onClick={() => {
                send({
                  type: "Speed up",
                });
              }}
            >
              Go back to list
            </button>
          </>
        )}
        {state.matches("Creating new todo.Showing form input") && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send({
                type: "Submit",
              });
            }}
          >
            <label>
              <Heading>Add your todo</Heading>
              <input
                onChange={(e) => {
                  send({
                    type: "Form input changed",
                    value: e.target.value,
                  });
                }}
              ></input>
            </label>
          </form>
        )}
      </div>
    </div>
  );
};

export default Todo;
