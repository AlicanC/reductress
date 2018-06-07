// @flow

import { createThunkMutator } from 'reductress';

import { createStore, createObservableProvider } from '..';

const createTestStore = () => {
  const initialState = {
    count: 0,
  };

  const provider = createObservableProvider();

  const store = createStore(provider, initialState);

  const { mutate } = createThunkMutator(store);

  return { store, mutate };
};

const incrementMutation = (state) => ({
  count: state.count + 1,
});

it('mutates', () => {
  const { store, mutate } = createTestStore();

  mutate(incrementMutation);
  mutate(incrementMutation);
  mutate(incrementMutation);

  expect(store.getState().count).toBe(3);
});

it('provides after mutation', () => {
  const { store, mutate } = createTestStore();

  const consumer = jest.fn();

  store.addConsumer(consumer);

  mutate(incrementMutation);

  expect(consumer).toHaveBeenLastCalledWith(store.getState());

  mutate(incrementMutation);
  mutate(incrementMutation);

  expect(consumer).toHaveBeenCalledTimes(3);
});

it('creates frozen store', () => {
  const { store } = createTestStore();

  expect(() => {
    // $FlowExpectError
    store.a = true;
  }).toThrow();
});

it('provides after setState', () => {
  const { store } = createTestStore();

  const consumer = jest.fn();

  store.addConsumer(consumer);

  store.setState(incrementMutation(store.getState()));

  expect(consumer).toHaveBeenLastCalledWith(store.getState());

  store.setState(incrementMutation(store.getState()));
  store.setState(incrementMutation(store.getState()));

  expect(consumer).toHaveBeenCalledTimes(3);
});
