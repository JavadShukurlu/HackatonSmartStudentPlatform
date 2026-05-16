export const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const minLength = (v = '', n = 6) => String(v).trim().length >= n;

export const inRange = (v, min, max) => {
  const n = Number(v);
  return !Number.isNaN(n) && n >= min && n <= max;
};

export const required = (v) => v !== undefined && v !== null && String(v).trim() !== '';
