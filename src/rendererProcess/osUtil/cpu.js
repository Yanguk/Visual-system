import _ from '../../lib/fp';
import { delay } from '../../lib/time';
import {
  add, subtract, bValue, makePercentage, log,
} from '../../lib/fp/util';

const CPU_INTERVAL_TIME = 1000;

const getCPUTotal = async () => {
  const cpus = await window.api.cpu();

  let idleSum = 0;

  const addIdle = _.pipe(bValue('idle'), idle => {
    idleSum += idle;
  });

  const total = _.go(
    cpus,
    _.map(bValue('times')),
    _.each(addIdle),
    _.map(Object.values),
    _.map(_.reduce(add)),
    _.reduce(add),
  );

  return {
    idleSum,
    total,
  };
};

const asyncCPU = async () => {
  const pre = await getCPUTotal();

  await delay(CPU_INTERVAL_TIME);

  const cur = await getCPUTotal();

  const iter = [cur, pre];

  const idle = _.go(iter, _.map(bValue('idleSum')), _.reduce(subtract));

  const total = _.go(iter, _.map(bValue('total')), _.reduce(subtract));

  const percentage = 1 - idle / total;

  return makePercentage(2, percentage);
};

const intervalFactory = time => {
  let interval = null;

  const start = fn => {
    interval = setInterval(() => {
      fn();
    }, time);
  };

  const stop = () => clearInterval(interval);

  return {
    start,
    stop,
  };
};

const cpuInterval = intervalFactory(CPU_INTERVAL_TIME);

cpuInterval.start(async () => {
  const usage = await asyncCPU();
  log('🚀 ~ file: cpu.js ~ line 80 ~ cpuInterval.start ~ usage', usage);
});
