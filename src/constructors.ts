import { sub } from "./arithmetic.js";
import { ZERO } from "./constants.js";
import { is_big_float, is_negative, is_zero } from "./predicates.js";
import type { IBigFloat, NumericValue } from "./types";

/** Construct a bigfloat object */
export function make_big_float(
  coefficient: bigint,
  exponent: bigint
): IBigFloat {
  if (coefficient === 0n) {
    return ZERO;
  }
  return Object.freeze(Object.create(null, <PropertyDescriptorMap>{ coefficient, exponent }));
}

/** Discard decimal digits. */
export function integer(value: IBigFloat): IBigFloat {
  value = make(value);
  const { coefficient, exponent } = value;
  if (exponent === 0n) {
    return value;
  }

  if (exponent > 0n) {
    return make_big_float(coefficient * 10n ** BigInt(exponent), 0n);
  }

  return make_big_float(coefficient / 10n ** BigInt(-exponent), 0n);
}

/** Convert strings, numbers and bigints to bigfloat. */
export function make(value: NumericValue): IBigFloat {
  if (is_big_float(value)) {
    return <IBigFloat>value;
  } else if (typeof value === "bigint") {
    return make_big_float(value, 0n);
  } else if (Number.isNaN(value) || [Infinity, -0, null, undefined].includes(<number>value)) {
    throw RangeError("Cannot convert " + String(value) + " to a BigFloat");
  } else if (["string", "number"].includes(typeof value)) {
    if (!Number.isFinite(Number(value))) {
      throw SyntaxError("Cannot convert " + String(value) + " to a BigFloat");
    }

    // Capturing groups
    // [1] int
    // [2] frac
    // [3] exp
    const parts = String(value).match(/^(-?\d+)(?:\.(\d*))?(?:e(-?\d+))?$/);
    if (parts) {
      const frac = parts[2] || "";
      return make_big_float(BigInt(parts[1] + frac), BigInt((Number(parts[3]) || 0) - frac.length));
    }
  }
  throw TypeError("Cannot convert " + String(value) + " to a BigFloat");
}

/** Convert a bigfloat to number. Use `to_string()` for a precise conversion. */
export function to_number(value: IBigFloat): number {
  if (is_big_float(value)) {
    return Number(value.coefficient * 10n ** value.exponent);
  } else if (["number", "bigint", "string"].includes(typeof value)) {
    return Number(value);
  }
  return NaN;
}

/** Convert a bigfloat to bigint. Decimal digits are thrown away. */
export function to_bigint(value: IBigFloat): bigint {
  return BigInt(to_string(integer(make(value))));
}

function normalize(value: IBigFloat): IBigFloat {
  let { coefficient, exponent } = value;
  if (exponent !== 0n) {
    if (exponent > 0n) {
      coefficient *= 10n ** BigInt(exponent);
      exponent = 0n;
    } else {
      while (exponent <= -7n) {
        if (coefficient % 10000000n !== 0n) {
          break;
        }
        coefficient /= 10000000n;
        exponent += 7n;
      }
      while (exponent < 0n) {
        if (coefficient % 10n !== 0n) {
          break;
        }
        coefficient /= 10n;
        exponent += 1n;
      }
    }
  }
  return make_big_float(coefficient, exponent);
}

/** Convert a bigfloat to string. */
export function to_string(value: IBigFloat): string {
  value = normalize(make(value));
  if (is_zero(value)) {
    return "0";
  }
  let s = String(is_negative(value) ? -value.coefficient : value.coefficient);
  if (value.exponent < 0n) {
    let point = s.length + Number(value.exponent);
    if (point <= 0) {
      s = "0".repeat(1 - point) + s;
      point = 1;
    }
    s = s.slice(0, point) + "." + s.slice(point);
  } else if (value.exponent > 0n) {
    s += "0".repeat(Number(value.exponent));
  }
  if (is_negative(value)) {
    s = "-" + s;
  }
  return s;
}

/** Discard integer part. */
export function fraction(value: IBigFloat): IBigFloat {
  return sub(value, integer(value));
}

/** Convert a bigfloat to scientific e-notation string  */
export function to_scientific(value: IBigFloat): string {
  value = normalize(make(value));
  if (is_zero(value)) {
    return "0";
  }
  let s = String(is_negative(value) ? -value.coefficient : value.coefficient);
  const e = value.exponent + BigInt(s.length) - 1n;
  if (s.length > 1) {
    s = s.slice(0, 1) + "." + s.slice(1);
  }
  if (e !== 0n) {
    s += "e" + String(e);
  }
  if (is_negative(value)) {
    s = "-" + s;
  }
  return s;
}
