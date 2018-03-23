// @flow

import { type Mutator } from "reductress-core";

type Obj = {
  a: (a: number) => "a",
  b: (b: number) => "b",
};

type Bleh = $ObjMap<Obj, <Args>((...args: Args) => *) => (...args: Args) => void>;

const a: Bleh = {
  a: () => {},
  b: () => {},
};

// export type Mutate<State, Mutations> =

// export type BasicMutator<State, Mutations> = Mutator<State>;

// export default function createBasicMutator<State, Mutations>(mutations: Mutations): () => BasicMutator<State, Mutations> {

//   return {
//     mutate: {
//       // ???
//     },
//   };
// }
