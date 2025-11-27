// Convert selected column to numeric array
export function toNumberArray(data, column) {
  return data
    .map(r => Number(r[column]))
    .filter(v => !isNaN(v));
}

export function mean(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function median(arr) {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(arr) {
  if (!arr.length) return null;
  const freq = {};
  arr.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const maxCount = Math.max(...Object.values(freq));
  const modeValue = Object.keys(freq).find(k => freq[k] === maxCount);
  return { value: modeValue, count: maxCount };
}

export function min(arr) {
  if (!arr.length) return null;
  return Math.min(...arr);
}

export function max(arr) {
  if (!arr.length) return null;
  return Math.max(...arr);
}

export function stddev(arr) {
  if (!arr.length) return null;
  const m = mean(arr);
  const variance = mean(arr.map(x => (x - m) ** 2));
  return Math.sqrt(variance);
}
