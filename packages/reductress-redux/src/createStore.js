// @flow

import { createObservableProvider, type ObservableProviderAddConsumer } from "reductress";
import {
  createStore as createReductressCoreStore,
  type Store as ReductressStore,
} from "reductress-core";

import createReduxMutator, { type Reducer, type Dispatch } from "./createReduxMutator";

export type Store<State, Action> = $ReadOnly<{
  getState: () => State,
  dispatch: Dispatch<Action>,
  subscribe: ObservableProviderAddConsumer<State>,
}>;
export type Enhancer<State, Action> = (
  createStore: typeof createStore,
) => (reducer: Reducer<State, Action>, initialState: State) => Store<State, Action>;

export default function createStore<State, Action>(
  reducer: Reducer<State, Action>,
  initialState: State,
  enhancer: ?Enhancer<State, Action>,
): Store<State, Action> {
  if (enhancer) {
    return enhancer(createStore)(reducer, initialState);
  }

  const provider = createObservableProvider();

  const reductressStore = createReductressCoreStore(provider, initialState);

  const { getState, addConsumer } = reductressStore;

  const { mutate } = createReduxMutator(reductressStore, reducer);

  const store = {
    getState,
    dispatch: mutate,
    subscribe: addConsumer,
  };

  Object.freeze(store);

  return store;
}
