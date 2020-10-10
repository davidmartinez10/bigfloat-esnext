import { sub } from "./arithmetic";
import { is_negative, is_zero } from "./predicates";
import { BigFloat } from "./types";

export function eq(comparahend: BigFloat, comparator: BigFloat): boolean {
  return comparahend === comparator || is_zero(sub(comparahend, comparator));
}

export function lt(comparahend: BigFloat, comparator: BigFloat): boolean {
  return is_negative(sub(comparahend, comparator));
}

export function lte(comparahend: BigFloat, comparator: BigFloat): boolean {
  return lt(comparahend, comparator) || eq(comparahend, comparator);
}

export function gt(comparahend: BigFloat, comparator: BigFloat): boolean {
  return lt(comparator, comparahend);
}

export function gte(comparahend: BigFloat, comparator: BigFloat): boolean {
  return gt(comparahend, comparator) || eq(comparahend, comparator);
}
