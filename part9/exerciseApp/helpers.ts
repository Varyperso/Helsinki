export function isValidNumber(x: unknown) : x is number {
  return typeof x === 'number' && !Number.isNaN(x);
}