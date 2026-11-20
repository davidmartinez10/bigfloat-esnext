export interface IBigFloat {
  coefficient: bigint;
  exponent: number;
}

export type NumericValue = string|number|IBigFloat|bigint;

export type TokenArray = ({
  type: string;
  value: string|IBigFloat
}|{
  type: string;
  value: boolean
})[];
