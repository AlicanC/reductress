// @flow

import { createStore as createCoreStore } from "reductress-core";
import createObservableProvider, { type AddConsumer } from "./createObservableProvider";

type Mutation<State> = (state: State) => State;
type MutationCreator<State, Args> = (...args: Args) => Mutation<State>;
type Mutate<State, MutationCreators: {}> = $ObjMap<
  MutationCreators,
  <Args>(MutationCreator<State, Args>) => (...args: Args) => void,
> & {
  $call: (mutation: Mutation<State>) => void,
};

type MutationCreatorsObj<State> = $ReadOnly<{
  [name: string]: MutationCreator<State, Array<*>>,
}>;

type Store<State, MutationCreators: MutationCreatorsObj<State>> = $ReadOnly<{
  getState: () => State,
  setState: (state: State) => void,
  mutate: Mutate<State, MutationCreators>,
  subscribe: AddConsumer<State>,
}>;

export default function createStore<State, MutationCreators: MutationCreatorsObj<State>>(
  initialState: State,
  mutationCreators: MutationCreators,
): Store<State, MutationCreators> {
  const createMutator = ({ getState, setState }) => {
    const mutate = (mutation) => setState(mutation(getState()));

    Object.keys(mutationCreators).forEach((key) => {
      const mutationCreator = mutationCreators[key];
      const mutateFn = (...args) => mutate(mutationCreator(...args));
      mutate[key] = mutateFn
    });

    return {
      mutate,
    };
  };

  const { getState, setState, mutate, addConsumer } = createCoreStore(
    createObservableProvider,
    createMutator,
    initialState,
  );

  return {
    getState,
    setState,
    mutate,
    subscribe: addConsumer,
  };
}
