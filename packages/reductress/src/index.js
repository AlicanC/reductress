// @flow

import { createStore } from "reductress-core";

import createObservableProvider from "./createObservableProvider";
import createThunkMutator from "./createThunkMutator";

export type {
  AddConsumer as ObservableProviderAddConsumer,
  Subscription as ObservableProviderSubscription,
} from "./createObservableProvider";

export { createStore, createObservableProvider, createThunkMutator };
