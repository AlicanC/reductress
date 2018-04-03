// @flow

import { type MutatorApi } from 'reductress-core';

export type ThunkMutation<State> = (state: State) => State;

export type ThunkMutator<State> = {
  mutate: (mutation: ThunkMutation<State>) => void,
};

export default function createThunkMutator<State>({
  getState,
  setState,
}: MutatorApi<State>): ThunkMutator<State> {
  const mutator = {
    mutate: (mutation) => setState(mutation(getState())),
  };

  Object.freeze(mutator);

  return mutator;
}
