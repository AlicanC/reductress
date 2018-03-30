// @flow

import Observable, {
  type Observer,
  type Subscription as ZenObservableSubscription,
} from "zen-observable";
import { type Provider } from "reductress-core";

export type Consumer<State> = (state: State) => void;
export type Subscription = ZenObservableSubscription;
export type AddConsumer<State> = (consumer: Consumer<State>) => Subscription;
export type ObservableProvider<State> = Provider<State, AddConsumer<State>>;

export default function createObservableProvider<State>(): ObservableProvider<State> {
  const observers: Set<Observer<State>> = new Set();

  const observable = new Observable((observer) => {
    observers.add(observer);

    return () => {
      observers.delete(observer);
    };
  });

  return {
    addConsumer: (consumer: Consumer<State>) => observable.subscribe(consumer),
    provide: (state: State) => observers.forEach((o) => o.next(state)),
  };
}
