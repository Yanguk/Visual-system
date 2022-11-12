export const curry = fn => (a, ...rest) =>
  rest.length ? fn(a, ...rest) : (...rest) => fn(a, ...rest);

export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;

export const bValue = curry((key, obj) => obj[key]);

export const identity = value => value;

export const makePercentage = curry((fixNum, float) =>
  Math.ceil(float * 10 ** (2 + fixNum)) / 100);

export const log = console.log;
