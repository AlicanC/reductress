// @flow

import { type MutatorApi } from 'reductress-core';

export type Reducer<State, Action> = (state: State, action: Action) => State;
export type Dispatch<Action> = (action: Action) => void;
export type ReduxMutator<Action> = {
  mutate: Dispatch<Action>,
};

export default function createReduxMutator<State, Action>(
  { getState, setState }: MutatorApi<State>,
  reducer: Reducer<State, Action>,
): ReduxMutator<Action> {
  const mutator = {
    mutate: (action) => setState(reducer(getState(), action)),
  };

  Object.freeze(mutator);

  return mutator;
}
