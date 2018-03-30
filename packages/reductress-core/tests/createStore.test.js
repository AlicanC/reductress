// @flow

import createStore from "../src/createStore";
import { createObservableProvider, createThunkMutator } from "reductress";

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

it("mutates", () => {
  const { store, mutate } = createTestStore();

  mutate(incrementMutation);
  mutate(incrementMutation);
  mutate(incrementMutation);

  expect(store.getState().count).toBe(3);
});

it("provides after mutation", () => {
  const { store, mutate } = createTestStore();

  const consumer = jest.fn();

  store.addConsumer(consumer);

  mutate(incrementMutation);

  expect(consumer).toHaveBeenLastCalledWith(store.getState());

  mutate(incrementMutation);
  mutate(incrementMutation);

  expect(consumer).toHaveBeenCalledTimes(3);
});

it("provides after setState", () => {
  const { store } = createTestStore();

  const consumer = jest.fn();

  store.addConsumer(consumer);

  store.setState(incrementMutation(store.getState()));

  expect(consumer).toHaveBeenLastCalledWith(store.getState());

  store.setState(incrementMutation(store.getState()));
  store.setState(incrementMutation(store.getState()));

  expect(consumer).toHaveBeenCalledTimes(3);
});
