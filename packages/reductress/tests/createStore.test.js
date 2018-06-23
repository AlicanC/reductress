// @flow

import { createStore, type Store } from '..';

const createTestStore = () => {
  type State = {
    count: number,
  };

  const initialState: State = {
    count: 0,
  };

  const mutationCreators = {
    increment: () => (state) => ({
      count: state.count + 1,
    }),
  };

  const store: Store<State, typeof mutationCreators> = createStore(initialState, mutationCreators);

  return { store };
};

it('creates frozen store', () => {
  const { store } = createTestStore();

  expect(() => {
    // $FlowExpectError
    store.a = true;
  }).toThrow();
});
