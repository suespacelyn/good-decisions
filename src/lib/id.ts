/** Small id helper — stable enough for local-first records. */
export function makeId(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}
