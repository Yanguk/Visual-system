const curry = (fn) => (a, ...rest) =>
    rest.length ? fn(a, ...rest) : (...rest) => fn(a, ...rest);

const reduce = _.curry((fn, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const a of iter) {
    acc = fn(acc, a);
  }

  return acc;
});

const go = (...rest) => _.reduce((a, f) => f(a), rest);

const pipe = (f, ...rest) => (...as) => _.go(f(...as), ...rest);

export default {
  curry,
  reduce,
  go,
  pipe,
};
