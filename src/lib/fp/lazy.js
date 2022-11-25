import { curry, isIterable } from './util';

const map = curry(function* (fn, list) {
  for (const item of list) {
    yield fn(item);
  }
});

const filter = curry(function* (fn, list) {
  for (const item of list) {
    if (fn(item)) {
      yield item;
    }
  }
});

const reject = curry(function* (fn, list) {
  for (const item of list) {
    if (!fn(item)) {
      yield item;
    }
  }
});

const range = function* (start, end, step = 1) {
  if (!end) {
    end = start;
    start = 0;
  }

  while (start < end) {
    yield start;
    start += step;
  }
};

const flatten = function* (iter) {
  for (const item of iter) {
    if (isIterable(item)) {
      yield *item;
    } else {
      yield item;
    }
  }
}

const getIndex = function* (iter) {
  const rage = L.range(iter.length);

  for (const item of iter) {
    yield [item, rage.next().value];
  }
};

const iterObjKey = curry(function* (f, obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      yield f([key, obj[key]]);
    }
  }
});

const until = curry(function* (f, iter) {
  for (const item of iter) {
    if (f(item)) {
      return;
    }

    yield item;
  }
})

const notUntil = curry(function* (f, iter) {
  for (const item of iter) {
    if (!f(item)) {
      return;
    }

    yield item;
  }
});

const bind = curry(function* (subIter, targetIter) {
  const sub = subIter[Symbol.iterator]();
  const target = targetIter[Symbol.iterator]();

  let subIterNext = sub.next();
  let targetIterNext = target.next();

  while (!subIterNext.done && !targetIterNext.done) {

    yield [targetIterNext.value, subIterNext.value];

    subIterNext = sub.next();
    targetIterNext = target.next();
  }
});

const take = curry(function* (limit, iter) {
  let count = -1;

  const iterator = iter[Symbol.iterator]();

  while (++count < limit && !iterator.done) {
    yield iterator.next().value;
  }
});

const L = {
  map,
  filter,
  range,
  flatten,
  reject,
  getIndex,
  iterObjKey,
  until,
  notUntil,
  bind,
  take,
};

export default L;
