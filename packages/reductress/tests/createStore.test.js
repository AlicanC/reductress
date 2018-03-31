// @flow

import createStore from "../src/createStore";
import { createObservableProvider, createThunkMutator } from "reductress";

const createTestStore = () => {
  const initialState = {
    count: 0,
  };

  const mutationCreators = {
    increment: () => (state) => ({
      count: state.count + 1,
    }),
  };

  const provider = createObservableProvider();

  const store = createStore(initialState, mutationCreators);

  return { store };
};

const incrementMutation = (state) => ({
  count: state.count + 1,
});

it("creates frozen store", () => {
  const { store } = createTestStore();

  expect(() => {
    // $FlowExpectError
    store.a = true;
  }).toThrow();
});
