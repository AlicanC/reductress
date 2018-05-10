// @flow

import * as React from 'react';
// $FlowFixMe
import TestRenderer from 'react-test-renderer';
import { createObservableProvider, createThunkMutator } from 'reductress';
import { createStore } from 'reductress-core';

import { createContext } from '..';

const createTestStore = () => {
  const initialState = {
    count: 0,
  };

  const provider = createObservableProvider();

  const store = createStore(provider, initialState);

  const { mutate } = createThunkMutator(store);

  return { store, mutate };
};

const incrementMutation = (state) => ({
  count: state.count + 1,
});

// it('consumer works without mapState', () => {
//   const { store, mutate } = createTestStore();

//   const context = createContext(store, { mutate });

//   const renderer = TestRenderer.create(
//     <context.Provider>
//       <context.Consumer>
//         {(reactContextValue) => JSON.stringify(reactContextValue)}
//       </context.Consumer>
//     </context.Provider>,
//   );

//   expect(renderer.toJSON()).toEqual(JSON.stringify({ state: { count: 0 } }));
// });

// it('consumer provides without mapState', () => {
//   const { store, mutate } = createTestStore();

//   const context = createContext(store, { mutate });

//   const renderer = TestRenderer.create(
//     <context.Provider>
//       <context.Consumer>
//         {(reactContextValue) => JSON.stringify(reactContextValue)}
//       </context.Consumer>
//     </context.Provider>,
//   );

//   expect(renderer.toJSON()).toEqual(JSON.stringify({ state: { count: 0 } }));

//   mutate(incrementMutation);
//   mutate(incrementMutation);
//   mutate(incrementMutation);

//   expect(renderer.toJSON()).toEqual(JSON.stringify({ state: { count: 3 } }));
// });

it('consumer works with mapState', () => {
  const { store, mutate } = createTestStore();

  const context = createContext(store, { mutate });

  const renderer = TestRenderer.create(
    <context.Provider>
      <context.Consumer mapState={(state) => state.count}>
        {(reactContextValue) => JSON.stringify(reactContextValue)}
      </context.Consumer>
    </context.Provider>,
  );

  expect(renderer.toJSON()).toEqual(JSON.stringify({ state: 0 }));
});

it('consumer provides with mapState', () => {
  const { store, mutate } = createTestStore();

  const context = createContext(store, { mutate });

  const renderer = TestRenderer.create(
    <context.Provider>
      <context.Consumer mapState={(state) => state.count}>
        {(reactContextValue) => JSON.stringify(reactContextValue)}
      </context.Consumer>
    </context.Provider>,
  );

  expect(renderer.toJSON()).toEqual(JSON.stringify({ state: 0 }));

  mutate(incrementMutation);
  mutate(incrementMutation);
  mutate(incrementMutation);

  expect(renderer.toJSON()).toEqual(JSON.stringify({ state: 3 }));
});

it('connect works with mapState', () => {
  const { store, mutate } = createTestStore();

  const context = createContext(store, { mutate });

  const BaseComponent = ({ state }) => JSON.stringify(state);

  const ConnectedComponent = context.connect({
    mapState: (state) => ({ state }),
  })(BaseComponent);

  const renderer = TestRenderer.create(
    <context.Provider>
      <ConnectedComponent />
    </context.Provider>,
  );

  expect(renderer.toJSON()).toEqual(JSON.stringify({ count: 0 }));
});

it('connect provides with mapState', () => {
  const { store, mutate } = createTestStore();

  const context = createContext(store, { mutate });

  const BaseComponent = ({ state }) => JSON.stringify(state);

  const ConnectedComponent = context.connect({
    mapState: (state) => ({ state }),
  })(BaseComponent);

  const renderer = TestRenderer.create(
    <context.Provider>
      <ConnectedComponent />
    </context.Provider>,
  );

  expect(renderer.toJSON()).toEqual(JSON.stringify({ count: 0 }));

  mutate(incrementMutation);
  mutate(incrementMutation);
  mutate(incrementMutation);

  expect(renderer.toJSON()).toEqual(JSON.stringify({ count: 3 }));
});
