// @flow

import Observable, { type Observer } from 'zen-observable';

function checkLock(isLocked: boolean) {
  if (isLocked) throw new Error('Tried to mutate store after it was locked.');
}

export type Updates<State> = Observable<State>;

export type Refiner<State, RefinedState> = (state: State) => RefinedState;

export type Store<State> = $ReadOnly<{
  getState: () => State,
  setState: (state: State) => void,
  updates: Updates<State>,
  getIsLocked: () => boolean,
  lock: () => void,
  refine: <RefinedState>(refiner: (state: State) => RefinedState) => Store<RefinedState>,
}>;

export default function createStore<State>(initialState: State): Store<State> {
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
  let isLocked: boolean = false;

  const getState = () => state;

  const setState = (nextState: State) => {
    checkLock(isLocked);
    state = nextState;
    send(state);
  };

  // Locking
  const getIsLocked = () => isLocked;

  const lock = () => {
    checkLock(isLocked);
    isLocked = true;
  };

  // Refining
  const refine = <RefinedState>(refiner: (state: State) => RefinedState): Store<RefinedState> => {
    lock();
    const refinedState = refiner(state);
    return createStore(refinedState);
  };

  // Store
  const store: Store<State> = {
    getState,
    setState,
    updates,
    getIsLocked,
    lock,
    refine,
  };

  Object.freeze(store);

  return store;
}
