// @flow
/* eslint-disable */

import React from 'react';
import { type ComponentType } from 'react';

import { type Consumer } from './createConsumer';

// declare type MapStateToProps<S, OP: Object, SP: Object> = (
//   state: S,
//   ownProps: OP,
// ) => ((state: S, ownProps: OP) => SP) | SP;

// declare type ComponentWithDefaultProps<DP: {}, P: {}, CP: P> = Class<React$Component<CP>> & {
//   defaultProps: DP,
// };

// declare class ConnectedComponent<OP, P> extends React$Component<OP> {
//   static WrappedComponent: Class<React$Component<P>>;
//   getWrappedInstance(): React$Component<P>;
//   props: OP;
//   state: void;
// }

// declare class ConnectedComponentWithDefaultProps<OP, DP, CP> extends React$Component<OP> {
//   static defaultProps: DP; // <= workaround for https://github.com/facebook/flow/issues/4644
//   static WrappedComponent: Class<React$Component<CP>>;
//   getWrappedInstance(): React$Component<CP>;
//   props: OP;
//   state: void;
// }

// declare type ConnectedComponentWithDefaultPropsClass<OP, DP, CP> = Class<
//   ConnectedComponentWithDefaultProps<OP, DP, CP>,
// >;

// declare type ConnectedComponentClass<OP, P> = Class<ConnectedComponent<OP, P>>;

// declare type Connector<OP, P> = (<DP: {}, CP: {}>(
//   component: ComponentWithDefaultProps<DP, P, CP>,
// ) => ConnectedComponentWithDefaultPropsClass<OP, DP, CP>) &
//   ((component: React$ComponentType<P>) => ConnectedComponentClass<OP, P>);

// type connect = <S, A, OP, SP>(
//   mapStateToProps: MapStateToProps<S, OP, SP>,
// ) => Connector<OP, $Supertype<SP & { dispatch: Function } & OP>>;

export type ConnectApi<State, Mutate> = $ReadOnly<{
  Consumer: Consumer<State, Mutate>,
}>;

export type ConnectMapState<State, MappedState: {}> = (state: State) => MappedState;
export type InjectedProps<MappedState: {}, Mutate> = MappedState & { mutate: Mutate };
export type ConnectHoc<MappedState: {}, Mutate> = <Props: {}>(
  component: ComponentType<Props>,
) => ComponentType<$Diff<Props, InjectedProps<MappedState, Mutate>>>;
export type ConnectConfig<State, MappedState: {}> = $ReadOnly<{
  mapState: ConnectMapState<State, MappedState>,
}>;
export type Connect<State, Mutate> = <MappedState: {}>(
  config: ConnectConfig<State, MappedState>,
) => ConnectHoc<MappedState, Mutate>;

export default function createConnect<State, Mutate>({
  Consumer,
}: ConnectApi<State, Mutate>): Connect<State, Mutate> {
  return ({ mapState }) => (Component) =>
    // $FlowFixMe
    (props) => (
      // <Consumer>
      //   {({ state, mutate }) => <Component {...props} {...mapState(state)} mutate={mutate} />}
      // </Consumer>
      <Consumer mapState={mapState}>
        {({ state, mutate }) => <Component {...props} {...state} mutate={mutate} />}
      </Consumer>
    );
}
