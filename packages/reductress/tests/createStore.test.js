// @flow

import { createStore } from '..';

const createTestStore = () => {
  const initialState = {
    count: 0,
  };

  const mutationCreators = {
    increment: () => (state) => ({
      count: state.count + 1,
    }),
  };

  const store = createStore(initialState, mutationCreators);

  return { store };
};

it('creates frozen store', () => {
  const { store } = createTestStore();

  expect(() => {
    // $FlowExpectError
    store.a = true;
  }).toThrow();
});
