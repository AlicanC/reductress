// @flow

import { createStore as createCoreStore, type Store as CoreStore } from 'reductress-core';

import createThunkMutator from './createThunkMutator';

type Mutation<State> = (state: State) => State;
type MutationCreator<State, Args> = (...args: Args) => Mutation<State>;
// prettier-ignore
type Mutate<State, MutationCreators: {}> = $ObjMap<
  MutationCreators,
  <Args>(MutationCreator<State, Args>) => (...args: Args) => void,
> & {
  [[call]]: (mutation: Mutation<State>) => void,
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

export type Store<State, MutationCreators: MutationCreatorsObj<State>> = $ReadOnly<{
  ...$Exact<CoreStore<State>>,
  mutate: Mutate<State, MutationCreators>,
}>;

export default function createStore<State, MutationCreators: MutationCreatorsObj<State>>(
  initialState: State,
  mutationCreators: MutationCreators,
): $Exact<Store<State, MutationCreators>> {
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

  const { mutate } = createMutator(coreStore);

  const store = {
    ...coreStore,
    mutate,
  };

  Object.freeze(store);

  return store;
}
