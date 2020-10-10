import { BIGINT_ZERO } from "./constants";
import { integer } from "./constructors";
import { eq } from "./relational";
import { BigFloat } from "./types";

export function is_big_float(big: any): boolean {
  return (
    typeof big === "object" &&
    typeof big.coefficient === "bigint" &&
    Number.isSafeInteger(big.exponent)
  );
}

export function is_number(token: string): boolean {
  return !Number.isNaN(Number(token));
}

export function is_negative(big: BigFloat): boolean {
  return big.coefficient < BIGINT_ZERO;
}

export function is_positive(big: BigFloat): boolean {
  return big.coefficient >= BIGINT_ZERO;
}

export function is_zero(big: BigFloat): boolean {
  return big.coefficient === BIGINT_ZERO;
}

export function is_integer(a: BigFloat): boolean {
  return eq(a, integer(a));
}
