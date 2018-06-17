# Reductress

[![Build Status](https://travis-ci.org/AlicanC/reductress.svg?branch=master)](https://travis-ci.org/AlicanC/reductress)
[![codecov](https://codecov.io/gh/AlicanC/reductress/branch/master/graph/badge.svg)](https://codecov.io/gh/AlicanC/reductress)

Simple and flexible state management library for JavaScript applications and libraries.

## Notes

This library is under active development. Stability won't be an issue, but API needs improvements.

## Usage

```javascript
import { createStore } from 'reductress-core';

// Create a Reductress store
const initialState = {
  foo: 'bar',
};
const store = createStore(initialState);

// Mutate the store
store.setState({ foo: 'baz' });

console.log(store.getState().foo); // 'baz'

// Use with Redux
import { createReduxMutator, createReduxStoreInterface } from 'reductress-redux';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FOO': {
      return {
        ...state,
        foo: action.payload,
      };
    }
  }
};
const reduxMutator = createReduxMutator(store, reducer /* , middlewares */);
const reduxStore = createReduxStoreInterface(reductressCoreStore, reduxMutator);

// Mutate the store, Redux way
reduxStore.dispatch({ type: 'SET_FOO', payload: 'ban' });

console.log(store.getState().foo); // 'ban'
console.log(reduxStore.getState().foo); // 'ban'
```
