import { make } from "./constructors.js";
import type { IBigFloat } from "./types";

export const ZERO: IBigFloat = Object.freeze(Object.create(null, <PropertyDescriptorMap>{ coefficient: 0n, exponent: 0n }));
export const ONE = make("1");
export const TWO = make("2");
export const EPSILON = make("0.0000000000000000000000000000000000000000000000001");
