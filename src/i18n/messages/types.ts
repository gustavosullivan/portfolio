import { pt } from "./pt";

/** Widen literal leaves so EN/ES can diverge from PT while keeping the same shape. */
type DeepMessageShape<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly DeepMessageShape<U>[]
        : T extends object
          ? { readonly [K in keyof T]: DeepMessageShape<T[K]> }
          : T;

export type Messages = DeepMessageShape<typeof pt>;
