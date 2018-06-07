// @flow

import { type Store as ReductressStore, type ObservableProviderAddConsumer } from 'reductress-core';

import {
  type ActionObject,
  type Dispatch,
  type ReplaceReducer,
  type ReduxMutator,
} from './createReduxMutator';

export type ReduxStore<State, Action: ActionObject> = $ReadOnly<{
  getState: () => State,
  dispatch: Dispatch<Action>,
  subscribe: ObservableProviderAddConsumer<State>,
  replaceReducer: ReplaceReducer<State, Action>,
}>;

export default function createReduxStoreInterface<State, Action: ActionObject>(
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
