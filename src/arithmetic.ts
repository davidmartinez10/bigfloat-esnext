import {
  EPSILON,
  ONE,
  TWO,
  ZERO
} from "./constants.js";
import { integer, make_big_float, to_number } from "./constructors.js";
import { PRECISION } from "./options.js";
import { is_integer, is_negative, is_zero } from "./predicates.js";
import { eq, gt, lt } from "./relational.js";
import type { IBigFloat } from "./types";

export function neg(value: IBigFloat): IBigFloat {
  return make_big_float(value.coefficient * -1n, value.exponent);
}

export function abs(value: IBigFloat): IBigFloat {
  return is_negative(value) ? neg(value) : value;
}

function conform_op(op: (a: bigint, b: bigint) => bigint) {
  return function (a: IBigFloat, b: IBigFloat) {
    const differential = a.exponent - b.exponent;
    return differential === 0n
      ? make_big_float(op(a.coefficient, b.coefficient), a.exponent)
      : differential > 0n
        ? make_big_float(
          op(a.coefficient * 10n ** differential, b.coefficient),
          b.exponent
        )
        : make_big_float(
          op(
            a.coefficient,
            b.coefficient * 10n ** -differential
          ),
          a.exponent
        );
  };
}

export const add = conform_op((a: bigint, b: bigint) => a + b);
export const sub = conform_op((a: bigint, b: bigint) => a - b);

export function mul(multiplicand: IBigFloat, multiplier: IBigFloat): IBigFloat {
  return make_big_float(
    multiplicand.coefficient * multiplier.coefficient,
    multiplicand.exponent + multiplier.exponent
  );
}

export function div(dividend: IBigFloat, divisor: IBigFloat): IBigFloat {
  if (is_zero(dividend)) {
    return ZERO;
  }

  if (is_zero(divisor)) {
    throw RangeError("Division by zero");
  }

  let { coefficient, exponent } = dividend;
  exponent -= divisor.exponent;

  if (exponent > PRECISION) {
    coefficient = coefficient * 10n ** exponent - BigInt(PRECISION);
    exponent = BigInt(PRECISION);
  }

  coefficient = coefficient / divisor.coefficient;
  return make_big_float(coefficient, exponent);
}

export function sqrt(n: IBigFloat): IBigFloat {
  let x = n;
  let y = ONE;
  while (gt(sub(x, y), EPSILON)) {
    x = div(add(x, y), TWO);
    y = div(n, x);
  }
  return x;
}

export function exponentiation(base: IBigFloat, exp: IBigFloat): IBigFloat {
  if (eq(exp, ZERO)) {
    return ONE;
  }

  if (is_negative(exp)) {
    return div(ONE, exponentiation(base, abs(exp)));
  }

  if (exp.exponent === 0n) {
    let result = base;
    let n = 1;
    while (n !== to_number(exp)) {
      result = mul(result, base);
      n += 1;
    }
    return result;
  }
  if (gt(exp, ONE) || eq(exp, ONE)) {
    const temp = exponentiation(base, div(exp, TWO));
    return mul(temp, temp);
  }
  let low = ZERO;
  let high = ONE;

  let sqr = sqrt(base);
  let acc = sqr;
  let mid = div(high, TWO);

  while (gt(abs(sub(mid, exp)), EPSILON)) {
    sqr = sqrt(sqr);

    if (lt(mid, exp) || eq(mid, exp)) {
      low = mid;
      acc = mul(acc, sqr);
    } else {
      high = mid;
      acc = mul(acc, div(ONE, sqr));
    }
    mid = div(add(low, high), TWO);
  }
  return acc;
}

export function ceil(n: IBigFloat): IBigFloat {
  if (is_integer(n)) {
    return n;
  } else {
    return make_big_float(integer(n).coefficient + 1n, 0n);
  }
}

export function floor(n: IBigFloat): IBigFloat {
  return integer(n);
}
