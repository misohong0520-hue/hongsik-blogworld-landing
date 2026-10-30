/** Interpolate between measured card tops. No scroll movement is controlled here. */
export function journeyProgress(tops: readonly number[], boundary: number) {
  if (tops.length < 2 || boundary <= tops[0]) return 0;
  const last = tops.length - 1;
  if (boundary >= tops[last]) return last;
  for (let index = 0; index < last; index++) {
    if (boundary < tops[index + 1]) {
      const distance = tops[index + 1] - tops[index];
      return index + (distance > 0 ? (boundary - tops[index]) / distance : 0);
    }
  }
  return last;
}
