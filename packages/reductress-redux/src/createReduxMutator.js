// @flow

import { type MutatorApi, type Mutator } from 'reductress-core';
import flow from 'lodash.flow';

export type Reducer<State, Action> = (state: State, action: Action) => State;
export type Dispatch<Action> = (action: Action) => void;
export type MiddlewareApi<State, Action> = $ReadOnly<{
  getState: () => State,
  dispatch: Dispatch<Action>,
}>;
export type Middleware<State, Action> = (
  api: MiddlewareApi<State, Action>,
) => (nextDispatch: Dispatch<Action>) => Dispatch<Action>;
export type Middlewares<State, Action> = $ReadOnlyArray<Middleware<State, Action>>;
export type ReduxMutator<Action> = Mutator<Dispatch<Action>>;

export default function createReduxMutator<State, Action>(
  { getState, setState }: MutatorApi<State>,
  reducer: Reducer<State, Action>,
  middlewares: ?Middlewares<State, Action>,
): ReduxMutator<Action> {
  const dispatch = (action) => setState(reducer(getState(), action));

  let middlewareDispatch: ?Dispatch<Action>;
  if (middlewares) {
    const middlewareApi: MiddlewareApi<State, Action> = {
      getState,
      dispatch,
    };

    Object.freeze(middlewareApi);

    const middlewareChain = middlewares.map((m) => m(middlewareApi));

    middlewareDispatch = flow(...middlewareChain)(dispatch);
  }

  const mutator = {
    mutate: middlewareDispatch || dispatch,
  };

  Object.freeze(mutator);

  return mutator;
}
