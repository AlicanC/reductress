// @flow

import { createStore as createCoreStore, type Updates } from 'reductress-core';

import createThunkMutator from './createThunkMutator';

type Mutation<State> = (state: State) => State;
type MutationCreator<State, Args> = (...args: Args) => Mutation<State>;
type Mutate<State, MutationCreators: {}> = $ObjMap<
  MutationCreators,
  <Args>(MutationCreator<State, Args>) => (...args: Args) => void,
> & {
  $call: (mutation: Mutation<State>) => void,
};

type MutationCreatorsObj<State> = $ReadOnly<{
  [name: string]: MutationCreator<
    State,
    Array<
      // $FlowFixMe
      *,
    >,
  >,
}>;

type Store<State, MutationCreators: MutationCreatorsObj<State>> = $ReadOnly<{
  getState: () => State,
  setState: (state: State) => void,
  mutate: Mutate<State, MutationCreators>,
  subscribe: $PropertyType<Updates<State>, 'subscribe'>,
}>;

export default function createStore<State, MutationCreators: MutationCreatorsObj<State>>(
  initialState: State,
  mutationCreators: MutationCreators,
): Store<State, MutationCreators> {
  const createMutator = (mutatorApi) => {
    const { mutate } = createThunkMutator(mutatorApi);

    Object.keys(mutationCreators).forEach((key) => {
      const mutationCreator = mutationCreators[key];
      const mutateFn = (...args) => mutate(mutationCreator(...args));
      mutate[key] = mutateFn;
    });

    Object.freeze(mutate);

    const mutator = {
      mutate,
    };

    Object.freeze(mutator);

    return mutator;
  };

  const coreStore = createCoreStore(initialState);
  const { getState, setState, updates } = coreStore;

  const { mutate } = createMutator(coreStore);

  const store = {
    getState,
    setState,
    mutate,
    subscribe: (fn) => updates.subscribe(fn),
  };

  Object.freeze(store);

  return store;
}
