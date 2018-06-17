// @flow

import { createReduxStore, type ReduxStore } from '..';

const createTestStore = (enhancer) => {
  type State = {| count: number |};
  type Action = { type: 'INCREMENT' };

  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'INCREMENT': {
        return {
          count: state.count + 1,
        };
      }
      default:
        return state;
    }
  };

  const initialState: State = {
    count: 0,
  };

  const reduxStore: ReduxStore<State, Action> = createReduxStore(reducer, initialState, enhancer);

  return reduxStore;
};

const incrementAction = {
  type: 'INCREMENT',
};

it('mutates', () => {
  const reduxStore = createTestStore();

  expect(reduxStore.getState().count).toBe(0);

  reduxStore.dispatch(incrementAction);

  expect(reduxStore.getState().count).toBe(1);
});

it('works with enhancer', () => {
  const reduxStore = createTestStore((createStore) => (...args) => createStore(...args));

  expect(reduxStore.getState().count).toBe(0);

  reduxStore.dispatch(incrementAction);

  expect(reduxStore.getState().count).toBe(1);
});

it('sends updates', () => {
  const reduxStore = createTestStore();

  const subscriber = jest.fn();

  reduxStore.subscribe(subscriber);

  expect(subscriber).toHaveBeenCalledTimes(0);

  reduxStore.dispatch(incrementAction);
  reduxStore.dispatch(incrementAction);
  reduxStore.dispatch(incrementAction);

  expect(subscriber).toHaveBeenCalledTimes(3);
});
