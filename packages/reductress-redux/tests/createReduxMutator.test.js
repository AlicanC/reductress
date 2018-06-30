// @flow

import { createStore, type Store } from 'reductress-core';

import { createReduxMutator, type ReduxMutator, type Reducer, type Middleware } from '..';

it('mutates', () => {
  type State = {
    count: number,
  };
  type Action = {
    type: 'INCREMENT',
  };

  const initialState: State = {
    count: 0,
  };

  const store: Store<State> = createStore(initialState);

  const reducer: Reducer<State, Action> = (state, action) => {
    if (action.type === 'INCREMENT') {
      return {
        ...state,
        count: state.count + 1,
      };
    }

    return state;
  };

  const reduxMutator: ReduxMutator<State, Action> = createReduxMutator(store, reducer);

  const action: Action = { type: 'INCREMENT' };

  reduxMutator.mutate(action);

  expect(store.getState().count).toBe(1);
});

it('works with middleware', () => {
  type State = {
    count: number,
  };
  type Action = {
    type: 'INCREMENT',
    payload: number,
  };

  const initialCount = Math.floor(Math.random() * 100);

  const initialState: State = {
    count: initialCount,
  };

  const store: Store<State> = createStore(initialState);

  const reducer: Reducer<State, Action> = (state, action) => {
    if (action.type === 'INCREMENT') {
      const { payload: amount = 1 } = action;

      return {
        ...state,
        count: state.count + amount,
      };
    }

    return state;
  };

  const middleware: Middleware<State, Action> = ({ getState, dispatch }) => {
    const { count } = getState();

    dispatch({ type: 'INCREMENT', payload: count });

    return (nextDispatch) => (action) => {
      return nextDispatch({ ...action, payload: action.payload + 1 });
    };
  };

  const reduxMutator: ReduxMutator<State, Action> = createReduxMutator(store, reducer, [
    middleware,
  ]);

  const action: Action = { type: 'INCREMENT', payload: 1 };

  reduxMutator.mutate(action);

  expect(store.getState().count).toBe(initialCount * 2 + 2);
});

it('replaceReducer works', () => {
  type State = {
    count: number,
  };
  type Action = {
    type: 'INCREMENT',
  };

  const initialState: State = {
    count: 0,
  };

  const store: Store<State> = createStore(initialState);

  const reducer: Reducer<State, Action> = (state, action) => {
    if (action.type === 'INCREMENT') {
      return {
        ...state,
        count: state.count + 1,
      };
    }

    return state;
  };

  const reduxMutator: ReduxMutator<State, Action> = createReduxMutator(store, reducer);

  const action: Action = { type: 'INCREMENT' };

  reduxMutator.mutate(action);

  expect(store.getState().count).toBe(1);

  const replacementReducer: Reducer<State, Action> = (state, action) => {
    if (action.type === 'INCREMENT') {
      return {
        ...state,
        count: state.count + 2,
      };
    }

    return state;
  };

  reduxMutator.replaceReducer(replacementReducer);

  reduxMutator.mutate(action);

  expect(store.getState().count).toBe(3);
});
