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

const L = {
  map,
  filter,
  range,
  flatten,
  reject,
  getIndex,
  iterObjKey,
};

export default L;
