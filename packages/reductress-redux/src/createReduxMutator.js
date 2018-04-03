// @flow

import { type MutatorApi, type Mutator } from 'reductress-core';
import flow from 'lodash.flow';

export type Reducer<State, Action> = (state: State, action: Action) => State;
export type Dispatch<Action> = (action: Action) => void;
export type ReplaceReducer<State, Action> = (nextReducer: Reducer<State, Action>) => void;
export type MiddlewareApi<State, Action> = $ReadOnly<{
  getState: () => State,
  dispatch: Dispatch<Action>,
}>;
export type Middleware<State, Action> = (
  api: MiddlewareApi<State, Action>,
) => (nextDispatch: Dispatch<Action>) => Dispatch<Action>;
export type Middlewares<State, Action> = $ReadOnlyArray<Middleware<State, Action>>;
export type ReduxMutator<State, Action> = Mutator<Dispatch<Action>> &
  $ReadOnly<{
    replaceReducer: ReplaceReducer<State, Action>,
  }>;

export default function createReduxMutator<State, Action>(
  { getState, setState }: MutatorApi<State>,
  initialReducer: Reducer<State, Action>,
  middlewares: ?Middlewares<State, Action>,
): ReduxMutator<State, Action> {
  let reducer = initialReducer;
  const baseDispatch: Dispatch<Action> = (action) => setState(reducer(getState(), action));

  let dispatch = baseDispatch;
  if (middlewares) {
    const middlewareApi: MiddlewareApi<State, Action> = {
      getState,
      dispatch: (action) => dispatch(action),
    };

    Object.freeze(middlewareApi);

    const middlewareChain = middlewares.map((m) => m(middlewareApi));

    dispatch = flow(...middlewareChain)(baseDispatch);
  }

  const mutator = {
    mutate: dispatch,
    replaceReducer: (nextReducer) => {
      reducer = nextReducer;
    },
  };

  Object.freeze(mutator);

  return mutator;
}
