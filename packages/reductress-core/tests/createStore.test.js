// @flow

import { createThunkMutator } from 'reductress';

import { createStore, type Store } from '..';

const createTestStore = () => {
  const initialState = {
    count: 0,
  };

  const store = createStore(initialState);

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

it('sends update after mutation', () => {
  const { store, mutate } = createTestStore();

  const subscriber = jest.fn();

  store.updates.subscribe(subscriber);

  mutate(incrementMutation);

  expect(subscriber).toHaveBeenLastCalledWith(store.getState());

  mutate(incrementMutation);
  mutate(incrementMutation);

  expect(subscriber).toHaveBeenCalledTimes(3);
});

it('creates frozen store', () => {
  const { store } = createTestStore();

  expect(() => {
    // $FlowExpectError
    store.a = true;
  }).toThrow();
});

it('sends update after setState', () => {
  const { store } = createTestStore();

  const subscriber = jest.fn();

  store.updates.subscribe(subscriber);

  store.setState(incrementMutation(store.getState()));

  expect(subscriber).toHaveBeenLastCalledWith(store.getState());

  store.setState(incrementMutation(store.getState()));
  store.setState(incrementMutation(store.getState()));

  expect(subscriber).toHaveBeenCalledTimes(3);
});

it('stops sending updates after unsubscription', () => {
  const { store } = createTestStore();

  const subscriber = jest.fn();

  const subscription = store.updates.subscribe(subscriber);

  store.setState(incrementMutation(store.getState()));

  expect(subscriber).toHaveBeenCalledTimes(1);

  subscription.unsubscribe();

  store.setState(incrementMutation(store.getState()));

  expect(subscriber).toHaveBeenCalledTimes(1);
});

it('getIsLocked returns false before locking', () => {
  const { store } = createTestStore();

  expect(store.getIsLocked()).toBe(false);
});

it('getIsLocked returns true after locking', () => {
  const { store } = createTestStore();

  store.lock();

  expect(store.getIsLocked()).toBe(true);
});

it('setState throws after locking', () => {
  const { store } = createTestStore();

  store.lock();

  expect(() => {
    store.setState({ count: 1 });
  }).toThrow();
});

it('lock throws after locking', () => {
  const { store } = createTestStore();

  store.lock();

  expect(() => {
    store.lock();
  }).toThrow();
});

it('refining locks the store', () => {
  const { store } = createTestStore();

  store.refine((s) => s);

  expect(store.getIsLocked()).toBe(true);
});

it('refining returns correct store', () => {
  const { store } = createTestStore();

  type RefinedState = {|
    foo: 'bar',
  |};

  const refinedState: RefinedState = { foo: 'bar' };
  const refinedStore: Store<RefinedState> = store.refine(() => refinedState);

  expect(refinedStore.getState()).toBe(refinedState);
});
