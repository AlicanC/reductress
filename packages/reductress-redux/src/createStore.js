// @flow

import {
  createStore as createReductressStore,
  createObservableProvider,
  type ObservableProviderAddConsumer,
} from "reductress";
import { type Store as ReductressStore } from "reductress-core";

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

  const reductressStore = createReductressStore(provider, initialState);

  const { getState, addConsumer } = reductressStore;

  const { mutate } = createReduxMutator(reductressStore, reducer);

  return {
    getState,
    dispatch: mutate,
    subscribe: addConsumer,
  };
}
