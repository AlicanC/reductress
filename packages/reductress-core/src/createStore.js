// @flow

export type Provider<State, AddConsumer> = $ReadOnly<{
  addConsumer: AddConsumer,
  provide: (state: State) => void,
}>;

export type CreateProvider<State, AddConsumer> = () => Provider<State, AddConsumer>;

export type Mutator<Mutate> = $ReadOnly<{
  mutate: Mutate,
}>;

export type CreateMutator<State, Mutate> = (api: {
  getState: () => State,
  setState: (state: State) => void,
}) => Mutator<Mutate>;

export type Store<State, Mutate, AddConsumer> = $ReadOnly<{
  getState: () => State,
  setState: (state: State) => void,
  mutate: Mutate,
  addConsumer: AddConsumer,
}>;

export default function createStore<State, Mutate, AddConsumer>(
  createProvider: CreateProvider<State, AddConsumer>,
  createMutator: CreateMutator<State, Mutate>,
  initialState: State,
): Store<State, Mutate, AddConsumer> {
  let state = initialState;

  const { addConsumer, provide } = createProvider();

  const getState = () => state;

  const setState = (nextState: State) => {
    state = nextState;
    provide(state);
  };

  const { mutate } = createMutator({ getState, setState });

  return {
    getState,
    setState,
    mutate,
    addConsumer,
  };
}
