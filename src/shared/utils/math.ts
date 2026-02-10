export function normalizeClamp(x: number, min: number, max: number): number {
  if (min === max)
    return 0

  return Math.min(Math.max((x - min) / (max - min), 0), 1)
}
