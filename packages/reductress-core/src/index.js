// @flow

import createStore from './createStore';
import createObservableProvider from './createObservableProvider';

export type { Store } from './createStore';

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

export type {
  ObservableProvider,
  AddConsumer as ObservableProviderAddConsumer,
  Subscription as ObservableProviderSubscription,
} from './createObservableProvider';

export { createStore, createObservableProvider };
