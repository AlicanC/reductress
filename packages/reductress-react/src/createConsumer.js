// @flow

import React, { type Node } from 'react';

import { type React$Context } from './createContext';
import { type ReactContextValue } from './createContext';

export type ConsumerApi<State, Mutate> = $ReadOnly<{
  reactContext: React$Context<ReactContextValue<State, Mutate>>,
}>;

export type ConsumerMapState<State, MappedState> = (state: State) => MappedState;
export type ContextValue<MappedState, Mutate> = $ReadOnly<{
  state: MappedState,
  mutate: Mutate,
}>;
export type ConsumerProps<State, Mutate, MappedState> = {
  mapState: ConsumerMapState<State, MappedState>,
  children: (value: ContextValue<MappedState, Mutate>) => Node,
};
export type Consumer<State, Mutate> = <MappedState>(
  props: ConsumerProps<State, Mutate, MappedState>,
) => Node;

export default function createConsumer<State, Mutate>({
  reactContext,
}: ConsumerApi<State, Mutate>): Consumer<State, Mutate> {
  return <MappedState>({
    mapState,
    children,
    ...props
  }: ConsumerProps<State, Mutate, MappedState>) => (
    <reactContext.Consumer {...props}>
      {({ state, mutate }: ReactContextValue<State, Mutate>) => {
        const mappedState = mapState(state);

        const contextValue = {
          state: mappedState,
          mutate,
        };

        Object.freeze(contextValue);

        return children(contextValue);
      }}
    </reactContext.Consumer>
  );
}
