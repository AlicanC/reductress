// @flow

import createStore from "../src/createStore";
import { createObservableProvider } from "reductress";

const createTestStore = () => {
  const createMutator = ({ getState, setState }) => ({
    mutate: (mutation) => setState(mutation(getState())),
  });

  const initialState = {
    count: 0,
  };

  const store = createStore(createObservableProvider, createMutator, initialState);

  return store;
};

const incrementMutation = (state) => ({
  count: state.count + 1,
});

it("mutates", () => {
  const store = createTestStore();

  store.mutate(incrementMutation);
  store.mutate(incrementMutation);
  store.mutate(incrementMutation);

  expect(store.getState().count).toBe(3);
});

it("provides after mutation", () => {
  const store = createTestStore();

  const consumer = jest.fn();

  store.addConsumer(consumer);

  store.mutate(incrementMutation);

  expect(consumer).toHaveBeenLastCalledWith(store.getState());

  store.mutate(incrementMutation);
  store.mutate(incrementMutation);

  expect(consumer).toHaveBeenCalledTimes(3);
});

it("provides after setState", () => {
  const store = createTestStore();

  const consumer = jest.fn();

  store.addConsumer(consumer);

  store.setState(incrementMutation(store.getState()));

  expect(consumer).toHaveBeenLastCalledWith(store.getState());

  store.setState(incrementMutation(store.getState()));
  store.setState(incrementMutation(store.getState()));

  expect(consumer).toHaveBeenCalledTimes(3);
});
