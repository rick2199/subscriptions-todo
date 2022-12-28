import { assign, createMachine } from "xstate";

export interface User {
  fullName: string;
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
      type: "updateInfo";
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
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4AV0HsBmAlgDZgB0eYALgMYAWBAdlAKproDEEODZjAbjgDWZVBmz5iZCjXpNWGBPxzUAhpQLcA2gAYAujt2JQABxywC67kZAAPRAFoAjAE5HpAKzOAzAA5f27XdHHwAmbRCAGhAAT0R3bQA2Ui9Axy8Adi9HbRd0kIBffKjRLFxCEnIqOkYWNnYMXHRSYyI1PBx0AFtSEvFyqSrZWoUlVUsGAwNrU3Nx6zsEe19nUgAWEMd1kPSfBK8QhJ9VqNiEBPSVn3cE8O1nV2cQo8Litj7JHrYAMUHIdmRjBA1GAAJIMdpTJAgGYWDQMeaITbpUhPBLuEIbPYXK7pE6IHbuUiOa4heIJBIHDKOF4gXplD4AoHqORsUgECAQEjsWDIABGnQskJMZlhVihC2CIVIAWcV2cQQ2pNJeIQqx8bi8j1WXnWjmCfhpdIkFUZahq8iapsoYAtDBUnTIsFoOAA7ua2HaHWDjMhKP8PfbQQwfZQAMK0FRMSBC6EiuZQ05pKXq7V3Db6lIJKILLzklGrILOdJo9UJYmrQ1vekmwFmlkYHq1622wOkJ2u90YT1BkPcvkCygxmHx0ALJ7aZI7HLadKbUI5LMxRBXIm5q7uYsJVbpGfOStiasiJudy1NsAAdTAvNmjudbqYl+vFh7vvYLqvN+9vvDkZgECHcZwtYpz2M4E6bNquYpCEXjuJqXjZogOorBcep3AqjhKvupTGkeTIno2TIXh+z5tneNSPp+wavjy-KCno0yAWKo5IasKGuNk8qYZh6Iqk4vhEqskF7OEsHwdh7w1vh9ankRACCfBqCo6DMOgRBkR2TAKUpKlqV+foqIplDKapRD6T+Ub-gxULDkBCZISEqykCmKSPHqPh+IhCC5hO2gec424lo4ZbuBWRS0lWuGEXWwyycC2nGbp6ntveUAJSZenUX6tEDgBsx2Sx3k3NK-mBe4pbliq2xJC5abuQa4VGv00XMrFLU2nUXA8GyDACMInwHlFVoEVaHUjL1yhmloeh5aK8LikhxKkGB2hqgW3FKiqaoalqOrph5XgSYeLUjWeFr1OgjTNK0lDtF0A04c1w0ye1FqKBNYxwpM1nCvlzG2EhWSkOc6TovEOzBGWKohR424+LOqx+at6RheFDA4BAcDWE1kiMX982FfYQluBDIT3I4Fxk9oCFLossFSlu2qOeVqyYWWYWvINzXSNUMl43NCJ094pCk+TlNgTTpzxE5TzBT44TOHsByrUdQ3fL8ED8yOAOLJ4It+MSq2hbkvjQ9qzmzuEKNG2WqtPcefM2UxBM6-Y7iEhTxaI2qOwo6Dxy0-YBwe0J+xHGBYRhBzEVcwyDtteynJgFrBWu8intbqt8Pw9uoVbYczmbK5+0NZzj1x9JbWjS2Dop-9Cz2EkmGyqJrN+Ec1xbYSWTanB3uK8Fe6NZF9uVxar0Bg6GmpTXL6UHXLsLKzFs5EWQUhUJKpJoXqZuRmiR2xXMXj6NlHPgvgv2On6Re1nvu5wHIGe8Dof7JqFI7IfUnH6yp8kda08KL-znhfBaqoJyhBgp4DCSpViLhAmBQSwloJiW8F-PCP8GyjXSklUBhMm5k3ljBNuvgCzwMQDBZEPdthPFciSaOONv6tRPmeHBplAFaSMhlMyWU8E62XvDVexZyrBXLI-ByTlap7wOugk6L1q5sD4QseWGpsicTlLOe4KovAZCJOieC6Yb4+DQcPWOJp1YyEgAAUUuh0SASiHC+B8MDA2xt5ShXcSqeWhJrjsyyKFL2BRTHl3MRgZgZ4IA2MaPYp2+NL56kJGtDYrhNSK32OIhAfgVj7BvijYIsEgjUkKPkIAA */
  createMachine<AuthenticationMachineContext, AuthenticationMachineEvent>(
    {
      id: "userProfile",
      initial: "fetchingUser",
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
                target: "#userProfile.fetchingUser",
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
