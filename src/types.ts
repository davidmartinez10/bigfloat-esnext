export interface BigFloat {
  coefficient: bigint;
  exponent: number;
}

export type NumericValue = string | number | BigFloat | bigint;

export type TokenArray = Array<
  { type: string; value: string | BigFloat } | { type: string; value: boolean }
>;
