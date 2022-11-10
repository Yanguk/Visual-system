const map = _.curry(function *(fn, list) {
  for (const item of list) {
    yield fn(item);
  }
});

const filter = _.curry(function *(fn, list) {
  for (const item of list) {
    if (fn(item)) {
      yield item;
    }
  }
});

const range = function *(start, end, step = 1) {
  if (!end) {
    end = start;
    start = 0;
  }

  while (start < end) {
    yield start;
    start += step;
  }
}

export default {
  map,
  filter,
  range,
};
