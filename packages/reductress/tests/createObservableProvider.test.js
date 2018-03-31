// @flow

import { createObservableProvider } from '..';

it('bleh', () => {
  const { addConsumer, provide } = createObservableProvider();

  const consumer = jest.fn();

  addConsumer(consumer);

  expect(consumer).toHaveBeenCalledTimes(0);

  const state = Symbol();

  provide(state);

  expect(consumer).toHaveBeenCalledTimes(1);
  expect(consumer).toHaveBeenLastCalledWith(state);
});
