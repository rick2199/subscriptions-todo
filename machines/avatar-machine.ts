import { assign, createMachine } from "xstate";

export type AvatarMachineContext = {
  avatarUrl: string;
  errorMessage: string | undefined;
  fieldEvent: any;
};

export type AvatarMachineEvent =
  | {
      type: "avatarUrlInputChanged";
      fieldEvent: any;
    }
  | {
      type: "done.invoke.avatar.fetchingAvatarUrl:invocation[0]";
      data: string;
    }
  | {
      type: "error.invoke.avatar.fetchingAvatarUrl:invocation[0]";
      data: Error;
    };

export const avatarMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMBuyAuyBOA6AlhBADZgDEAHrFhmLsgGa3YAUAjAAxcCUZamOAkVIBtDgF1EoAA4B7WPgz5ZAOykgKiNgA4AnLh0B2AKwAaEAE9EAWgAs2gL4Pz-LHgZgMAYwAW+FVAAguhuAKrYxGQQqnT+qLIA1nSugh7efgHBAtjhxAhxsl6Yyipi4mXqcgpKquqaCGyGAGy4xroATBzGtk292gDMbLaG5lYIxhz9uNpN9nq6Q8btura2Ti4hqZ6+-kGbORFkYNjYsnjSxJgMZwC29Pu4aTuZ+7n5KvFFNaUSFUggVUUJTqNmWHFwTW0hjYuiaE209mMTVGiEMy1w7WMbCxMIm7VsMPWIBSeBJADFtj5ILhYD5ZAB3XZZMIRACSKmkAFcMHxXmyOdyAMI+ZABSB-GTyIG1f5jdrabTmeoE2wYozGIkk3Cc6QQTBgZk4KIxAgfRLJB46vW0Q3Yd6fYqqMoSgFS74ghD9frtVraNr9EwohBNDj6OFNTGay26-W2o4nM64C5XW73bLamM2-b2wqOn7lCSVN3A-71L0+4x+3QBsyWRC9fTYiMaokqWQQODqElF6ol0D1axe7QQqEwuEcBF+5F1hDWNj9Yy4Wy6Fcrwy6DhNfoR9pR9OEEhgHvStSlxAcIO2b17tyPSlMvnEY-us+z+U+4a2JadFbyybTsZl0XKFvVDfFZkaXQb0EclKUgZ8+w0RB7CDTpwWXVd2nxSY9HnaDSX2Cl0mpWkGQfbJcnZLkMAQmV+0QWFUIVfCM2tA19lo096IQC8Z0MewWKtfUIFtTiPV4sYOn0FsNnTWDiIgABRBNsHg-5ARfbiJK0Tc1icBwgA */
  createMachine<AvatarMachineContext, AvatarMachineEvent>(
    {
      id: "avatar",
      initial: "iddle",
      context: {
        avatarUrl: "",
        fieldEvent: null,
        errorMessage: undefined,
      },
      schema: {
        services: {} as {
          fetchAvatar: {
            data: string;
          };
        },
      },
      states: {
        iddle: {
          after: {
            2000: {
              target: "fetchingAvatarUrl",
            },
          },
        },
        fetchingAvatarUrl: {
          invoke: {
            src: "fetchAvatar",
            onDone: [
              {
                actions: "assignAvatarToContext",
                target: "avatarFetched",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "avatarFetchedErrored",
              },
            ],
          },
        },
        avatarFetched: {
          initial: "showingAvatarUrlInput",
          states: {
            showingAvatarUrlInput: {
              on: {
                avatarUrlInputChanged: {
                  actions: "assignFieldEventToContext",
                  target: "#avatar.updateAvatar",
                },
              },
            },
          },
        },
        updateAvatar: {
          invoke: {
            src: "updateAvatarSrc",
            onDone: [
              {
                target: "updatedAvatar",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "avatarFetched",
              },
            ],
          },
        },
        updatedAvatar: {},
        avatarFetchedErrored: {},
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
    },
    {
      actions: {
        assignAvatarToContext: assign((context, event) => {
          if (
            event.type === "done.invoke.avatar.fetchingAvatarUrl:invocation[0]"
          ) {
            return {
              avatarUrl: event.data,
            };
          }
          return {};
        }),
        assignErrorToContext: assign((context, event) => {
          if (
            event.type === "error.invoke.avatar.fetchingAvatarUrl:invocation[0]"
          ) {
            return {
              errorMessage: (event.data as Error).message,
            };
          }
          return {};
        }),
        assignFieldEventToContext: assign((context, event) => {
          if (event.type === "avatarUrlInputChanged") {
            return {
              fieldEvent: event.fieldEvent,
            };
          }
          return {};
        }),
      },
    }
  );

export default avatarMachine;
