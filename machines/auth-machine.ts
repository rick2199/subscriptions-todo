import { assign, createMachine } from "xstate";

export interface User {
  full_name: string;
  avatar_url: string;
}

export type AuthenticationMachineContext = {
  user: User | null;
  errorMessage: string | undefined;
  newFullName: string;
  newAvatar_url: string;
};

export type AuthenticationMachineEvent =
  | {
      type: "fullNameInputChanged";
      fullName: string;
    }
  | {
      type: "avatarUrlInputChanged";
      avatar_url: string;
    }
  | {
      type: "submit";
    }
  | {
      type: "done.invoke.userProfile.fetchingUser:invocation[0]";
      data: User;
    }
  | {
      type: "error.invoke.userProfile.fetchingUser:invocation[0]";
      data: Error;
    };

const authenticationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMBuyAuyBOA6AZmBgMYAWAlgHZQCqsY2AxBAPaVi5WosDWHamHASJkqtetgRcWxTOTYBtAAwBdZSsSgADi1jkM8yppAAPRAFoAjAE5LuAKzWAzAA5XSpfcsuATEp8ANCAAnoj2SgBsuE6elk4A7E6WSjbxPgC+6UECWHiEJBTUdAyMDNgseFoANpj4FQC2uDlC+aJFElKU3LIGiqrqxjp6vUZIphau1rgALD6Wsz7xLhFOPhEu00GhCBHxUy72Ef5K1rbWPhuZ2ei5uACuWhBy7Qy4sKQsAO5ixdiUyPUwABJShaO4YRj4O5VKoAOQBwNB4IAwqRkNRIAMxkN9IZjNtrBEgmYEEl4rhUk5HF45j57BksiBmngHk8DC88O8vj8JP9ASCwRDYHcAEb1fRY7S6XFsYwkskU6yJamWWn0raIaYuK5Mm5CVnPcSvLnfagAQT12Bo2CqAvBjGZ1ttSIwqPRMAgkpAOJGcsQSTsSmmlmS1hpqvVIU12sZzPuj0NvzeH1NUAtgitNrtQtF4owXp9eLG8pDuCDIZO4bpgSjCD80wcSwjOrjBowYF+zDYHGkfCalvjbI7HWkPUM6gL0t9xYs8SUuDnZODex81n88Q1O1LLjcax8SRSSoZ1wzg8ww5KZQquGqtQa-dPbYvklHcj6alUgynRdAJPMc4XJQl0sFc10WTddjsVxVgifdklSBlGUoFgIDgYxmS-YYf3GBBzGmYMFxcVVThA841ycTcrEWMsPA8Xw3FVEMWwHVpCiNbBMJlUZfwmZxCOI2xQKAzdwgbC5LHWfxCRgoNmMfBN2XYzjpx43D7HsCl4niCJpiDFwlniaZ4nsTZa3MJwpnCDxkkcJVznpew5NuNseWNFNXL+BFs2U7C-3JEDtN0rUDKMkzN0JJz9QUjzk25c1LSdbzsW-WUZ1w-ytJ0vSQuM0ztn3edHNjAcn1+HzUtU8y+KbVdBLI4TazXOxDgieYkhMwLj11R8JAAMREUhIAAUWwcpsEgcruJw8yd1wdZ2uDMMTKWzcXE8BwIla6YFs6zJMiAA */
  createMachine<AuthenticationMachineContext, AuthenticationMachineEvent>(
    {
      id: "userProfile",
      initial: "iddle",
      context: {
        user: null,
        errorMessage: undefined,
        newFullName: "",
        newAvatar_url: "",
      },
      schema: {
        services: {} as {
          fetchUser: {
            data: User;
          };
          updateUser: {
            data: void;
          };
        },
      },
      states: {
        iddle: {
          after: {
            1000: {
              target: "fetchingUser",
            },
          },
        },
        fetchingUser: {
          invoke: {
            src: "fetchUser",
            onDone: [
              {
                actions: "assignUserToContext",
                target: "updatingUser",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "userFetchedErrored",
              },
            ],
          },
        },
        updatingUser: {
          initial: "showingUsernameInput",
          type: "parallel",
          states: {
            showingUsernameInput: {
              on: {
                fullNameInputChanged: {
                  actions: "assignUsernameInputToContext",
                },
                submit: {
                  target: "#userProfile.updateUser",
                },
              },
            },
            showingAvatarUrlInput: {
              on: {
                avatarUrlInputChanged: {
                  actions: "assignAvatarUrlInputToContext",
                },
                submit: {
                  target: "#userProfile.updateUser",
                },
              },
            },
          },
        },
        updateUser: {
          invoke: {
            src: "updateUserSrc",
            onDone: [
              {
                target: "#userProfile.iddle",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "updatingUser",
              },
            ],
          },
        },
        userFetchedErrored: {},
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
    },
    {
      actions: {
        assignUserToContext: assign((context, event) => {
          if (
            event.type === "done.invoke.userProfile.fetchingUser:invocation[0]"
          ) {
            return {
              user: event.data,
            };
          }
          return {};
        }),
        assignErrorToContext: assign((context, event) => {
          if (
            event.type === "error.invoke.userProfile.fetchingUser:invocation[0]"
          ) {
            return {
              errorMessage: (event.data as Error).message,
            };
          }
          return {};
        }),
        assignUsernameInputToContext: assign((context, event) => {
          if (event.type === "fullNameInputChanged") {
            return {
              newFullName: event.fullName,
            };
          }
          return {};
        }),

        assignAvatarUrlInputToContext: assign((context, event) => {
          if (event.type === "avatarUrlInputChanged") {
            return {
              newAvatar_url: event.avatar_url,
            };
          }
          return {};
        }),
      },
    }
  );

export default authenticationMachine;
