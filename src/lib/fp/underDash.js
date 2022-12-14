import L from './lazy';
import { curry } from './util';

const go1 = (target, f) => target instanceof Promise
  ? target.then(f)
  : f(target);

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

const pipe = (f, ...rest) => (...as) => go(f(...as), ...rest);

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

const map = curry(pipe(L.map, takeAll));

const filter = curry(pipe(L.filter, takeAll));

const reject = curry(pipe(L.reject, takeAll));

const flatten = pipe(L.flatten, takeAll);

const each = curry((f, iter) => {
  for (const item of iter) {
    f(item);
  }

  return iter;
});

const tap = curry((f, iter) => {
  const a = iter;

  f([...a]);

  return iter;
});

const join = curry((joinStr = '', iter) => iter.join(joinStr));

const range = pipe(L.range, takeAll);

const getIndex = pipe(L.getIndex, takeAll);

const iterObjKey = f => pipe(L.iterObjKey(f), iter => [...iter]);

const until = curry(pipe(L.until, takeAll));

const notUntil = curry(pipe(L.notUntil, takeAll));

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
  filter,
  reject,
  flatten,
  join,
  range,
  getIndex,
  iterObjKey,
  until,
  notUntil,
};

export default _;
