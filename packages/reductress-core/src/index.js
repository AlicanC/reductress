// @flow

import createStore from "./createStore";

export type { Store } from "./createStore";

export type Provider<State, AddConsumer> = $ReadOnly<{
  addConsumer: AddConsumer,
  provide: (state: State) => void,
}>;

export type MutatorApi<State> = $ReadOnly<{
  getState: () => State,
  setState: (state: State) => void,
}>;

export type Mutator<Mutate> = $ReadOnly<{
  mutate: Mutate,
}>;

export { createStore };
