// @flow

import { createStore } from "reductress-core";
import createObservableProvider from "./createObservableProvider";

export type { AddConsumer as ObservableProviderAddConsumer } from "./createObservableProvider";
export { createStore, createObservableProvider };
