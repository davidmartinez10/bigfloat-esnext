import * as arithmetic from "./arithmetic.js";
import { set_precision } from "./constants.js";
import * as constructors from "./constructors.js";
import evaluate from "./interpreter.js";
import * as predicates from "./predicates.js";
import * as relational from "./relational.js";

export { Decimal } from "./decimal.js";
export { BigFloat } from "./types";

const bigfloat = Object.freeze({
  BigFloat: constructors.make,
  evaluate,
  set_precision,
  ...arithmetic,
  ...predicates,
  ...constructors,
  ...relational
});

if (typeof module === "object") {
  Object.assign(exports, bigfloat);
}

export default bigfloat;
