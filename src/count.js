export function countWords(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const freq = new Map();
  for (const w of words) {
    const k = w.toLowerCase();
    freq.set(k, (freq.get(k) || 0) + 1);
  }
  return { total: words.length, unique: freq.size, freq };
}
