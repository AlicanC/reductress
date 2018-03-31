// @flow

import { createStore, type Store } from '..';

const createTestStore = () => {
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

  const reduxStore: Store<State, Action> = createStore(reducer, initialState);

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

it('provides', () => {
  const reduxStore = createTestStore();

  const consumer = jest.fn();

  reduxStore.subscribe(consumer);

  expect(consumer).toHaveBeenCalledTimes(0);

  reduxStore.dispatch(incrementAction);
  reduxStore.dispatch(incrementAction);
  reduxStore.dispatch(incrementAction);

  expect(consumer).toHaveBeenCalledTimes(3);
});
