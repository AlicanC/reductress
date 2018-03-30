// @flow

import { type Store, type MutatorApi } from "reductress-core";

export type ThunkMutation<State> = (state: State) => State;

export type ThunkMutator<State> = {
  mutate: (mutation: ThunkMutation<State>) => void,
};

export default function createThunkMutator<State>({
  getState,
  setState,
}: MutatorApi<State>): ThunkMutator<State> {
  return {
    mutate: (mutation) => setState(mutation(getState())),
  };
}
