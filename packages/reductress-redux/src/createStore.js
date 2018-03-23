// @flow

import {
  createStore as createReductressStore,
  createObservableProvider,
  type ObservableProviderAddConsumer,
} from "reductress";
import {
  type CreateMutator,
  type CreateProvider,
  type Store as ReductressStore,
} from "reductress-core";

export type Reducer<State, Action> = (state: State, action: Action) => State;
export type Dispatch<Action> = (action: Action) => void;
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

  const createMutator = ({ getState, setState }) => ({
    mutate: (action) => setState(reducer(getState(), action)),
  });

  const { getState, addConsumer, mutate } = createReductressStore(
    createObservableProvider,
    createMutator,
    initialState,
  );

  return {
    getState,
    dispatch: mutate,
    subscribe: addConsumer,
  };
}
