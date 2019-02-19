/**
 * @returns An array containing all numbers from `from` to `to` (inclusive)
 */
export function fromTo(from: number, to: number): number[] {
  const values: number[] = [];

  for (let i = from; i <= to; i++) {
    values.push(i);
  }

  return values;
}
