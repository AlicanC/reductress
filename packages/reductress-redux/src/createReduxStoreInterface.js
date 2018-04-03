// @flow

import { type ObservableProviderAddConsumer } from 'reductress';
import { type Store as ReductressStore } from 'reductress-core';

import { type Dispatch, type ReplaceReducer, type ReduxMutator } from './createReduxMutator';

export type ReduxStore<State, Action> = $ReadOnly<{
  getState: () => State,
  dispatch: Dispatch<Action>,
  subscribe: ObservableProviderAddConsumer<State>,
  replaceReducer: ReplaceReducer<State, Action>,
}>;

export default function createReduxStoreInterface<State, Action>(
  reductressStore: ReductressStore<State, ObservableProviderAddConsumer<State>>,
  reduxMutator: ReduxMutator<State, Action>,
): ReduxStore<State, Action> {
  const { getState, addConsumer } = reductressStore;

  const { mutate, replaceReducer } = reduxMutator;

  const store = {
    getState,
    dispatch: mutate,
    subscribe: addConsumer,
    replaceReducer,
  };

  Object.freeze(store);

  return store;
}
