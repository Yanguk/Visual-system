import L from './lazy';
import { curry } from './util';

const go1 = (target, f) => target instanceof Promise
  ? target.then(f)
  : f(target);

const take = curry((limit, iter) => {
  const res = [];

  for (const item of iter) {
    res.push(item);

    if (res.length === limit) {
      return res;
    }
  }

  return res;
});

const takeAll = take(Infinity);

const reduce = curry((fn, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }

  return go1(acc, function recur(acc) {
    let cur = iter.next();

    while (!cur.done) {
      acc = fn(acc, cur.value);

      if (acc instanceof Promise) {
        return acc.then(recur);
      }

      cur = iter.next();
    }

    return acc;
  });
});

const go = (...rest) => reduce((target, f) => f(target), rest);

const pipe =
  (f, ...rest) =>
  (...as) =>
    go(f(...as), ...rest);

const map = curry(pipe(L.map, takeAll));

const flatten = pipe(L.flatten, takeAll);

const each = curry((f, iter) => {
  for (const item of iter) {
    f(item);
  }

  return iter;
});

const tap = curry((f, iter) => (f([...iter]), iter));

const _ = {
  take,
  takeAll,
  map,
  reduce,
  go,
  go1,
  pipe,
  each,
  tap,
  flatten,
};

export default _;
