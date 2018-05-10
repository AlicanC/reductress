// @flow

import { createContext as createReactContext, type ComponentType, type Node } from 'react';
import { type ObservableProviderAddConsumer } from 'reductress';
import { type Store, type Mutator } from 'reductress-core';

import createProvider, { type Provider } from './createProvider';
import createConsumer, { type Consumer } from './createConsumer';
import createConnect, { type Connect } from './createConnect';

// TODO: Use offical type
export type React$Context<T> = {
  Provider: ComponentType<{ value: T }>,
  Consumer: ComponentType<{ children: (value: T) => Node }>,
};

export type ReactContextValue<State, Mutate> = $ReadOnly<{
  state: State,
  mutate: Mutate,
}>;

export type Context<State, Mutate> = $ReadOnly<{
  Provider: Provider,
  Consumer: Consumer<State, Mutate>,
  connect: Connect<State, Mutate>,
}>;

export default function createContext<
  State,
  AddConsumer: ObservableProviderAddConsumer<State>,
  Mutate,
>(store: Store<State, AddConsumer>, mutator: Mutator<Mutate>): Context<State, Mutate> {
  const { getState, addConsumer } = store;
  const { mutate } = mutator;

  const getReactContextValue = () => {
    const reactContextValue = {
      state: getState(),
      mutate,
    };

    Object.freeze(reactContextValue);

    return reactContextValue;
  };

  const reactContextValue = getReactContextValue();
  const reactContext: React$Context<ReactContextValue<State, Mutate>> = createReactContext(
    reactContextValue,
  );

  const providerApi = {
    addConsumer,
    reactContext,
    getReactContextValue,
  };

  Object.freeze(providerApi);

  const Provider = createProvider(providerApi);

  const consumerApi = {
    reactContext,
  };

  Object.freeze(consumerApi);

  const Consumer = createConsumer(consumerApi);

  const connectApi = {
    Consumer,
  };

  Object.freeze(connectApi);

  const connect = createConnect(connectApi);

  return {
    Provider,
    Consumer,
    connect,
  };
}
