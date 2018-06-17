// @flow

import createStore from './createStore';

export type { Store, Updates } from './createStore';

export type MutatorApi<State> = $ReadOnly<{
  getState: () => State,
  setState: (state: State) => void,
}>;

export type Mutator<Mutate> = $ReadOnly<{
  mutate: Mutate,
}>;

export { createStore };
