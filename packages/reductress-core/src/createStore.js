// @flow

import { type Provider } from '.';

export type Store<State, AddConsumer> = $ReadOnly<{
  getState: () => State,
  setState: (state: State) => void,
  addConsumer: AddConsumer,
}>;

export default function createStore<State, AddConsumer>(
  provider: Provider<State, AddConsumer>,
  initialState: State,
): Store<State, AddConsumer> {
  let state = initialState;

  const { addConsumer, provide } = provider;

  const getState = () => state;

  const setState = (nextState: State) => {
    state = nextState;
    provide(state);
  };

  const store = {
    getState,
    setState,
    addConsumer,
  };

  Object.freeze(store);

  return store;
}
