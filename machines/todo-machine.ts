import { createMachine, assign } from "xstate";

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAIC2BDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALradiUAAdZxVesMgAHogC0ARgAcAVgoB2Z44BsATmf37L3tnLS1HABoQAE87ewBmV2cAXyTIoRwCEk4JelJGITYOSgUBCnSRLPFaXPyZOQUlc01dDXsDJBATWDM1UksbBAcXd09ff0Dg0Ijo2Mc4imTUkHLMsWpqqQLWMAAnHdQdiiMAGxUAMwPsMpkM0WyNvOkWeVJeRt79fUsunosOgaGrg83j8ASCITCkRigwATHF7AsUmkbhU1gVMDlIKwAMI7MAqMCYcgAdy+HR+TX6iDiABYfBRfDC3F44m4tB5PDCaVC7M44l4KD4tLTmcK3H5PEjlijVpx0ZiIKwACJgY5gZRgMnGUyU-7UukMnxMllsjmOLk8waeGmC4U00WsiWOKUrO6UXH41SPEmYZQyCgAZUIqGJUguO2wmDIRgArspWAAxS5R0ix5SYIi4PKQLWdHW9KkIOGOChxRyBLzs5nmnz2S1OelaGmVoVObw0lwwl0yt0UD0qKQ+v0YQPB0OPcOR6Nx1gBmMAI2wZlzFILeqLZdL5a8lbc1ZhtfrNIRTZbWjbXg7zi7S1dlT7eIH3rAxN9-oDuG4UmHqHY6mKrz8IIPb3v2XqMEO76ft+MgvG8A7qJ8ujfPmfygNCcJuBQp5aK2jjtp2kQDJ4WiGj4bhxAetJzL43YYLcoGPuBRIvm+I4fl+jw-tsewHEcpzKJO1z0ainBgYOrE-oG0FcbBDQIc0ejIeSqF9B0GGsthza4ee+GXoR1iICRZEUVRHb8j4dHCLKlAqmqzHcUUXCAaUd5rHZ6owRgcGKApSHtNq3S6qAAxeM4NpeI4FE0s2MLOH4kIzIMTgInS-jOB457Ah2VkMe5qqebJGA8fshwnOclzCdZvYeQ5cmAe8iEtMpgW-GpIWIGFEVRbSsXxSE0zQrYMIHhQaXBJl9jZc6t4gfl9leVguylViAZGGAkCYDGRgrqphbmq47KUeFcyOFoI1xJaDhwoKU3CnFWXWjNyIiTZFC1YtmDLQcWJWLAygEhQuBnBqOwABQPVoACUrBuZwH1FUtvF4hAu1BWuHUIAd2GmSdZbnXCV1BGNd3HY9jgdjSKRLKQ6BwJYcNgCh6NoYZVoxWNUwUWdPhxORMJE24MKc9ROmMjuuWiVUkiPAUzNtYWtgdqRzgsmWMJBOC55XTCuEUPYx5C+efhuHStKS298rVJA8vBWzfjuPC5peLrZoWklDg+AK9jkcKtLxDFYQW72OSLbAX3IzbKks+1bNK17nNhNzuF80L3JJZ4W4JEKGtuJ2QuLC91WMZ6Emvj+tsY3H9jChQTI0p4Rpwndjg+JafILNpLjwl7e7MoX0qvb24nPuX75jmGybTsoleswCziuPXjcXS3bdJXCrg+EKrc+N4cQJAEcTByXT4QZJUGcYwFfRwr64HsL7L2pRvPmb4XiWphWlnheV43kXeXwwKnVDAs9Y4DASJvZkNJ2T2DiglU2V0OwliFCKSsjoF7PUHsXeahUr43G+ijUBhZ-BYQXsyA8p0CaXQ9vEeY40MohCmk9amSQgA */
  createMachine(
    {
      context: {
        todos: [] as string[],
        errorMessage: undefined as string | undefined,
        createNewTodoFormInput: "",
      },
      tsTypes: {} as import("./todo-machine.typegen").Typegen0,
      schema: {
        services: {} as {
          loadTodos: {
            data: string[];
          };
          saveTodo: {
            data: void;
          };
          deleteTodo: {
            data: void;
          };
        },
        events: {} as
          | {
              type: "Create new";
            }
          | {
              type: "Form input changed";
              value: string;
            }
          | {
              type: "Submit";
            }
          | {
              type: "Delete";
              todo: string;
            }
          | {
              type: "Speed up";
            },
      },
      id: "Todo machine",
      initial: "Loading Todos",
      states: {
        "Loading Todos": {
          invoke: {
            src: "loadTodos",
            onDone: [
              {
                actions: "assignTodosToContext",
                cond: "Has todos",
                target: "Todos Loaded",
              },
              {
                target: "Creating new todo",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "Loading todos errored",
              },
            ],
          },
        },
        "Todos Loaded": {
          on: {
            "Create new": {
              target: "Creating new todo",
            },
            Delete: {
              target: "Deleting todo",
            },
          },
        },
        "Loading todos errored": {},
        "Creating new todo": {
          initial: "Showing form input",
          states: {
            "Showing form input": {
              on: {
                "Form input changed": {
                  actions: "assignFormInputToContext",
                },
                Submit: {
                  target: "Saving todo",
                },
              },
            },
            "Saving todo": {
              invoke: {
                src: "saveTodo",
                onDone: [
                  {
                    target: "#Todo machine.Loading Todos",
                  },
                ],
                onError: [
                  {
                    actions: "assignErrorToContext",
                    target: "Showing form input",
                  },
                ],
              },
            },
          },
        },
        "Deleting todo": {
          invoke: {
            src: "deleteTodo",
            onDone: [
              {
                target: "Loading Todos",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "Deleting todo errored",
              },
            ],
          },
        },
        "Deleting todo errored": {
          after: {
            "2500": {
              target: "Todos Loaded",
            },
          },
          on: {
            "Speed up": {
              target: "Todos Loaded",
            },
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        "Has todos": (context, event) => {
          return event.data.length > 0;
        },
      },
      actions: {
        assignTodosToContext: assign((context, event) => {
          return {
            todos: event.data,
          };
        }),
        assignErrorToContext: assign((context, event) => {
          return {
            errorMessage: (event.data as Error).message,
          };
        }),
        assignFormInputToContext: assign((context, event) => {
          return {
            createNewTodoFormInput: event.value,
          };
        }),
      },
    }
  );
