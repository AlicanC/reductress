// @flow

import { createObservableProvider } from '..';

it('provides consumer with new state', () => {
  const { addConsumer, provide } = createObservableProvider();

  const consumer = jest.fn();

  addConsumer(consumer);

  expect(consumer).toHaveBeenCalledTimes(0);

  const state = Symbol();

  provide(state);

  expect(consumer).toHaveBeenCalledTimes(1);
  expect(consumer).toHaveBeenLastCalledWith(state);
});

it('stops providing after unsubscription', () => {
  const { addConsumer, provide } = createObservableProvider();

  const consumer = jest.fn();

  const subscription = addConsumer(consumer);

  expect(consumer).toHaveBeenCalledTimes(0);

  const state = Symbol();

  provide(state);

  expect(consumer).toHaveBeenCalledTimes(1);
  expect(consumer).toHaveBeenLastCalledWith(state);

  subscription.unsubscribe();

  provide(Symbol());

  expect(consumer).toHaveBeenCalledTimes(1);
  expect(consumer).toHaveBeenLastCalledWith(state);
});
