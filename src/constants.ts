import { make } from "./constructors.js";
import { BigFloat } from "./types";

export const BIGINT_ZERO = BigInt("0");
export const BIGINT_ONE = BigInt("1");
export const BIGINT_TEN = BigInt("10");
export const BIGINT_TEN_MILLION = BigInt("10000000");
export const ZERO: BigFloat = Object.create(null);
ZERO.coefficient = BIGINT_ZERO;
ZERO.exponent = 0;
Object.freeze(ZERO);

export let PRECISION = -4;

export function set_precision(n: number): void {
  n = Number(n);
  if (!Number.isInteger(n) || Number(n) >= 0) {
    throw Error("Only negative integers are allowed for precision.");
  }
  PRECISION = n;
}

export const EPSILON = make("0.0000000000000000000000000000000000000000000000001");
export const ONE = make("1");
export const TWO = make("2");
