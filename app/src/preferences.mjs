const prefix = 'vivelande:';
export function get(key) {
  try { return JSON.parse(localStorage.getItem(prefix + key)); } catch { return null; }
}
export function save(key, value) {
  try { localStorage.setItem(prefix + key, JSON.stringify(value)); return true; } catch { return false; }
}
export function fraction(position, length) {
  return length > 0 ? Math.max(0, Math.min(1, position / length)) : 1;
}
