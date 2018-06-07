// @flow

import React, { type ComponentType, PureComponent } from 'react';
import {
  type ObservableProviderAddConsumer,
  type ObservableProviderSubscription,
} from 'reductress-core';

import { type React$Context } from './createContext';
import { type ReactContextValue } from './createContext';

export type ProviderApi<
  State,
  AddConsumer: ObservableProviderAddConsumer<State>,
  Mutate,
> = $ReadOnly<{
  addConsumer: AddConsumer,
  reactContext: React$Context<ReactContextValue<State, Mutate>>,
  getReactContextValue: () => ReactContextValue<State, Mutate>,
}>;

export type Provider = ComponentType<mixed>;

export default function createProvider<
  StoreState,
  AddConsumer: ObservableProviderAddConsumer<StoreState>,
  Mutate,
>({
  addConsumer,
  reactContext,
  getReactContextValue,
}: ProviderApi<StoreState, AddConsumer, Mutate>): Provider {
  type ProviderState = {
    reactContextValue: ReactContextValue<StoreState, Mutate>,
  };

  return class extends PureComponent<mixed, ProviderState> {
    state = {
      reactContextValue: getReactContextValue(),
    };
    subscription: ObservableProviderSubscription | null = null;

    componentDidMount() {
      this.subscription = addConsumer(() => {
        this.setState({
          reactContextValue: getReactContextValue(),
        });
      });
    }

    componentWillUnmount() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    render() {
      const { reactContextValue } = this.state;

      return <reactContext.Provider {...this.props} value={reactContextValue} />;
    }
  };
}
