import { abs, add, ceil, div, exponentiation, floor, mul, neg, sqrt, sub } from "./arithmetic.js";
import { make, make_big_float, to_string } from "./constructors.js";
import { evaluate } from "./interpreter.js";
import { is_integer, is_negative, is_positive, is_zero } from "./predicates.js";
import { eq, gt, gte, lt, lte } from "./relational.js";
import { PRECISION, set_precision } from "./options.js";
import type { IBigFloat, NumericValue } from "./types";

// eslint-disable-next-line no-restricted-syntax
export class BigFloat implements IBigFloat {
  readonly exponent: bigint;
  readonly coefficient: bigint;
  readonly [Symbol.toStringTag]: "BigFloat" = "BigFloat";
  constructor(n: NumericValue) {
    const { exponent, coefficient } = make(n);
    this.exponent = exponent;
    this.coefficient = coefficient;
    if (!(this instanceof BigFloat)) {
      return new BigFloat(n);
    }
  }

  static get precision(): number { return PRECISION; }
  static set precision(n: number) { set_precision(n); }
  static evaluate = evaluate;
  static eq = eq;
  static gt = gt;
  static lt = lt;
  static gte = gte;
  static lte = lte;

  // decimalPlaces(): number { return Number(-this.exponent); } WRONG
  isInteger(): boolean { return is_integer(this); }
  isNegative(): boolean { return is_negative(this); }
  isPositive(): boolean { return is_positive(this); }
  isZero(): boolean { return is_zero(this); }
  equals(y: NumericValue): boolean { return eq(this, make(y)); }
  greaterThan(y: NumericValue): boolean { return gt(this, make(y)); }
  greaterThanOrEqualTo(y: NumericValue): boolean { return gte(this, make(y)); }
  lessThan(y: NumericValue): boolean { return lt(this, make(y)); }
  lessThanOrEqualTo(y: NumericValue): boolean { return lte(this, make(y)); }
  absoluteValue(): BigFloat { return new BigFloat(abs(this)); }
  negated(): BigFloat { return new BigFloat(neg(this)); }
  sqrt(): BigFloat { return new BigFloat(sqrt(this)); }
  dividedBy(y: NumericValue): BigFloat { return new BigFloat(div(this, make(y))); }
  minus(y: NumericValue): BigFloat { return new BigFloat(sub(this, make(y))); }
  plus(y: NumericValue): BigFloat { return new BigFloat(add(this, make(y))); }
  times(y: NumericValue): BigFloat { return new BigFloat(mul(this, make(y))); }
  toPower(y: NumericValue): BigFloat { return new BigFloat(exponentiation(this, make(y))); }
  ceil(): BigFloat { return new BigFloat(ceil(this)); }
  floor(): BigFloat { return new BigFloat(floor(this)); }

  toString(): string { return to_string(this); }
  valueOf(): IBigFloat { return make_big_float(this.coefficient, this.exponent); }
}
