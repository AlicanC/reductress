// @flow

import { type Store as ReductressStore, type Updates as ReductressUpdates } from 'reductress-core';

import { type Dispatch, type ReplaceReducer, type ReduxMutator } from './createReduxMutator';

export type ReduxStore<State, Action> = $ReadOnly<{
  getState: () => State,
  dispatch: Dispatch<Action>,
  subscribe: $PropertyType<ReductressUpdates<State>, 'subscribe'>,
  replaceReducer: ReplaceReducer<State, Action>,
}>;

export default function createReduxStoreInterface<State, Action>(
  reductressStore: ReductressStore<State>,
  reduxMutator: ReduxMutator<State, Action>,
): ReduxStore<State, Action> {
  const { getState, updates } = reductressStore;

  const { mutate, replaceReducer } = reduxMutator;

  const store = {
    getState,
    dispatch: mutate,
    subscribe: (fn) => updates.subscribe(fn),
    replaceReducer,
  };

  Object.freeze(store);

  return store;
}
