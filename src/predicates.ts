import { BigFloat } from "./bigfloat.js";
import { integer } from "./constructors.js";
import { eq } from "./relational.js";
import type { IBigFloat, NumericValue } from "./types";

export function is_big_float(value: NumericValue): boolean {
  return value instanceof BigFloat || (
    typeof value === "object"
    && typeof value.coefficient === "bigint"
    && typeof value.exponent === "bigint"
  );
}

export function is_negative(value: IBigFloat): boolean {
  return value.coefficient < 0n;
}

export function is_positive(value: IBigFloat): boolean {
  return value.coefficient >= 0n;
}

export function is_zero(value: IBigFloat): boolean {
  return value.coefficient === 0n;
}

export function is_integer(value: IBigFloat): boolean {
  return eq(value, integer(value));
}
