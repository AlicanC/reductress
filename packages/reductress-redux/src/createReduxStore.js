// @flow

import { createObservableProvider } from 'reductress';
import { createStore as createReductressCoreStore } from 'reductress-core';

import createReduxMutator, { type ActionObject, type Reducer } from './createReduxMutator';
import createReduxStoreInterface, { type ReduxStore } from './createReduxStoreInterface';

export type Enhancer<State, Action: ActionObject> = (
  createStore: typeof createReduxStore,
) => (reducer: Reducer<State, Action>, initialState: State) => ReduxStore<State, Action>;

export default function createReduxStore<State, Action: ActionObject>(
  reducer: Reducer<State, Action>,
  initialState: State,
  enhancer: ?Enhancer<State, Action>,
): ReduxStore<State, Action> {
  if (enhancer) {
    return enhancer(createReduxStore)(reducer, initialState);
  }

  const provider = createObservableProvider();
  const reductressStore = createReductressCoreStore(provider, initialState);
  const reduxMutator = createReduxMutator(reductressStore, reducer);

  const reduxStoreInterface = createReduxStoreInterface(reductressStore, reduxMutator);

  return reduxStoreInterface;
}
