// @flow

import { createStore } from "..";

test("mutate", () => {
  const mutationCreators = {
    increment: () => (state) => ({
      count: state.count + 1,
    }),
  };

  const store = createStore(
    {
      count: 0,
    },
    mutationCreators,
  );

  expect(store.getState()).toEqual({ count: 0 });

  store.mutate.increment();
  expect(store.getState()).toEqual({ count: 1 });

  store.mutate.increment();
  store.mutate.increment();
  store.mutate.increment();
  expect(store.getState()).toEqual({ count: 4 });
});

test("mutate w/ argumemt", () => {
  const mutationCreators = {
    increment: (amount: number) => (state) => ({
      count: state.count + amount,
    }),
  };

  const store = createStore(
    {
      count: 0,
    },
    mutationCreators,
  );

  store.mutate.increment(2);
  expect(store.getState()).toEqual({ count: 2 });
});

test("provide", () => {
  const mutationCreators = {
    increment: () => (state) => ({
      count: state.count + 1,
    }),
  };

  const store = createStore(
    {
      count: 0,
    },
    mutationCreators,
  );

  let prevState = store.getState();
  const consumer = jest.fn();

  store.subscribe(consumer);
  expect(consumer).toHaveBeenCalledTimes(0);

  store.mutate.increment();
  expect(consumer).toHaveBeenCalledTimes(1);
  expect(consumer).toHaveBeenLastCalledWith({ count: 1 });

  store.mutate.increment();
  store.mutate.increment();
  store.mutate.increment();
  expect(consumer).toHaveBeenCalledTimes(4);
  expect(consumer).toHaveBeenLastCalledWith({ count: 4 });
});
