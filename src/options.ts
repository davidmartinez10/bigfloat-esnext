export let PRECISION = -4;

export function set_precision(n: number): void {
  n = Number(n);
  if (!Number.isSafeInteger(n) || Number(n) >= 0) {
    throw TypeError("Only negative integers are allowed for precision.");
  }
  PRECISION = n;
}
