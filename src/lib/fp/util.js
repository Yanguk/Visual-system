export const curry = fn => (a, ...rest) =>
  rest.length ? fn(a, ...rest) : (...rest) => fn(a, ...rest);

export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;

export const bValue = curry((key, obj) => obj[key]);

export const identity = value => value;

export const execIdentity = curry((a, f) => f(a));

export const makePercentage = curry((fixNum, float) =>
  Math.ceil(float * 10 ** (2 + fixNum)) / 100);

export const push = curry((arr, item) => (arr.push(item), item));

export const shift = curry((arr, item) => (arr.shift(item), item));

export const isIterable = target => target && target[Symbol.iterator];
