// @flow

import { createStore, type Store } from '..';

test('mutate', () => {
  const mutationCreators = {
    increment: () => (state) => ({
      count: state.count + 1,
    }),
  };

  type State = {
    count: number,
  };

  const initialState: State = {
    count: 0,
  };

  const store: Store<State, typeof mutationCreators> = createStore(initialState, mutationCreators);

  expect(store.getState()).toEqual({ count: 0 });

  store.mutate.increment();
  expect(store.getState()).toEqual({ count: 1 });

  store.mutate.increment();
  store.mutate.increment();
  store.mutate.increment();
  expect(store.getState()).toEqual({ count: 4 });
});

test('mutate w/ argumemt', () => {
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

test('send update', () => {
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

  const subscriber = jest.fn();

  store.updates.subscribe(subscriber);
  expect(subscriber).toHaveBeenCalledTimes(0);

  store.mutate.increment();
  expect(subscriber).toHaveBeenCalledTimes(1);
  expect(subscriber).toHaveBeenLastCalledWith({ count: 1 });

  store.mutate.increment();
  store.mutate.increment();
  store.mutate.increment();
  expect(subscriber).toHaveBeenCalledTimes(4);
  expect(subscriber).toHaveBeenLastCalledWith({ count: 4 });
});
