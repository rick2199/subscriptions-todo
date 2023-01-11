import { assign, createMachine } from "xstate";

export interface Todo {
  task: string;
  priority: string;
  categoryId: string;
}

export type TodoMachineContext = {
  todos: Todo[];
  errorMessage: string | undefined;
  createNewTodo: Todo | null;
};

export type TodoMachineEvent =
  | {
      type: "createNew";
    }
  | {
      type: "formTodoChange";
      value: Todo;
    }
  | {
      type: "submit";
    }
  | {
      type: "delete";
      todo: Todo;
    }
  | {
      type: "done.invoke.todos.loadingTodos:invocation[0]";
      data: Todo[];
    }
  | {
      type: "error.invoke.todos.loadingTodos:invocation[0]";
      data: Error;
    };

const todoMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMBuyAuyBOA6AZmBgMYAWAlgHZQCqsY2AxBAPaVi5WosDWHamHASJkqtetgRcWxTOTYBtAAwBdZSsSgADi1jkM8yppAAPRAFoAjAE5LuAKzWAzAA5XSpfcsuATEp8ANCAAnoj2SgBsuE6elk4A7E6WSjbxPgC+6UECWHiEJBTUdAyMDNgseFoANpj4FQC2uDlC+aJFElKU3LIGiqrqxjp6vUZIphau1rgALD6Wsz7xLhFOPhEu00GhCBHxUy72Ef5K1rbWPhuZ2ei5uACuWhBy7Qy4sKQsAO5ixdiUyPUwABJShaO4YRj4O5VKoAOQBwNB4IAwqRkNRIAMxkN9IZjNtrBEgmYEEl4rhUk5HF45j57BksiBmngHk8DC88O8vj8JP9ASCwRDYHcAEb1fRY7S6XFsYwkskU6yJamWWn0raIaYuK5Mm5CVnPcSvLnfagAQT12Bo2CqAvBjGZ1ttSIwqPRMAgkpAOJGcsQSTsSmmlmS1hpqvVIU12sZzPuj0NvzeH1NUAtgitNrtQtF4owXp9eLG8pDuCDIZO4bpgSjCD80wcSwjOrjBowYF+zDYHGkfCalvjbI7HWkPUM6gL0t9xYs8SUuDnZODex81n88Q1O1LLjcax8SRSSoZ1wzg8ww5KZQquGqtQa-dPbYvklHcj6alUgynRdAJPMc4XJQl0sFc10WTddjsVxVgifdklSBlGUoFgIDgYxmS-YYf3GBBzGmYMFxcVVThA841ycTcrEWMsPA8Xw3FVEMWwHVpCiNbBMJlUZfwmZxCOI2xQKAzdwgbC5LHWfxCRgoNmMfBN2XYzjpx43D7HsCl4niCJpiDFwlniaZ4nsTZa3MJwpnCDxkkcJVznpew5NuNseWNFNXL+BFs2U7C-3JEDtN0rUDKMkzN0JJz9QUjzk25c1LSdbzsW-WUZ1w-ytJ0vSQuM0ztn3edHNjAcn1+HzUtU8y+KbVdBLI4TazXOxDgieYkhMwLj11R8JAAMREUhIAAUWwcpsEgcruJw8yd1wdZ2uDMMTKWzcXE8BwIla6YFs6zJMiAA */
  createMachine<TodoMachineContext, TodoMachineEvent>(
    {
      id: "todos",
      initial: "iddle",
      context: {
        todos: [],
        errorMessage: undefined,
        createNewTodo: null,
      },
      schema: {
        services: {} as {
          loadTodos: {
            data: Todo[];
          };
          saveTodo: {
            data: void;
          };
        },
      },
      states: {
        iddle: {
          after: {
            1000: {
              target: "loadingTodos",
            },
          },
        },
        loadingTodos: {
          invoke: {
            src: "loadTodos",
            onDone: [
              {
                actions: "assignTodosToContext",
                cond: "hasTodos",
                target: "todosLoaded",
              },
              {
                target: "creatingTodo",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "loadingTodosError",
              },
            ],
          },
        },
        todosLoaded: {},
        loadingTodosError: {},
        creatingTodo: {
          initial: "showingTodoForm",
          states: {
            showingTodoForm: {
              on: {
                formTodoChange: {
                  actions: "assignTodoFormToContext",
                },
                submit: {
                  target: "savingTodo",
                },
              },
            },
            savingTodo: {
              invoke: {
                src: "saveTodo",
                onDone: [
                  {
                    target: "#todos.loadingTodos",
                  },
                ],
                onError: [
                  {
                    actions: "assignErrorToContext",
                    target: "showingTodoForm",
                  },
                ],
              },
            },
          },
        },
        createdTodo: {},
        createTodoError: {},
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
    },
    {
      guards: {
        hasTodos: (context, event) => {
          if (event.type === "done.invoke.todos.loadingTodos:invocation[0]") {
            return event.data.length > 0;
          } else {
            return false;
          }
        },
      },
      actions: {
        assignTodosToContext: assign((context, event) => {
          if (event.type === "done.invoke.todos.loadingTodos:invocation[0]") {
            return {
              todos: event.data,
            };
          } else {
            return {};
          }
        }),
        assignErrorToContext: assign((context, event) => {
          if (event.type === "error.invoke.todos.loadingTodos:invocation[0]") {
            return {
              errorMessage: (event.data as Error).message,
            };
          } else {
            return {};
          }
        }),
        assignTodoFormToContext: assign((context, event) => {
          if (event.type === "formTodoChange") {
            return {
              createNewTodo: event.value,
            };
          } else {
            return {};
          }
        }),
      },
    }
  );

export default todoMachine;
