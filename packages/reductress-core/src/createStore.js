// @flow

import Observable, { type Observer } from 'zen-observable';

export type Updates<State> = Observable<State>;

export type Store<State> = $ReadOnly<{
  getState: () => State,
  setState: (state: State) => void,
  updates: Updates<State>,
}>;

export default function createStore<State>(initialState: State): $Exact<Store<State>> {
  // State observation
  const observers: Set<Observer<State>> = new Set();

  const updates = new Observable((observer) => {
    observers.add(observer);
    return () => {
      observers.delete(observer);
    };
  });

  const send = (state: State) => observers.forEach((o) => o.next(state));

  // State management
  let state = initialState;

  const getState = () => state;

  const setState = (nextState: State) => {
    state = nextState;
    send(state);
  };

  // Store
  const store = {
    getState,
    setState,
    updates,
  };

  Object.freeze(store);

  return store;
}
