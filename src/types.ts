export interface IBigFloat {
  readonly coefficient: bigint;
  readonly exponent: bigint;
}

export type NumericValue = string | number | IBigFloat | bigint;

