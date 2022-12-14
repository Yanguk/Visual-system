/* eslint-disable max-len */
import { DOMAIN_TIME_DIFF, memoryInfoEnum } from '../../lib/constant';
import { curry, execFn, push } from '../../lib/fp/util';
import _ from '../../lib/fp/underDash';
import $ from '../../lib/simpleDom';

const root = $.qs('#root');

export const receiveChannel = channel => window.connect.on(channel);

export const makeUnmount = () => {
  const clearFns = [];

  return [push(clearFns), () => _.each(execFn, clearFns)];
};

export const makeComponent = renderFn => (...rest) => {
  const [unmount, clearEvent] = makeUnmount();

  renderFn(unmount, ...rest);

  return clearEvent;
};

export const getTimeDomain = () => {
  const t = Date.now();
  const domain = [t - DOMAIN_TIME_DIFF, t];
  return domain;
};

export const insertRealTimeGraphData = curry((arr, data) => {
  const info = { data, date: new Date() };

  arr.push(info);

  _.go(
    arr,
    _.notUntil(item => item?.date && (item.date <= new Date(info.date - DOMAIN_TIME_DIFF + 100))),
    _.each(() => arr.shift()),
  );
});

export const renderDom = el => {
  window.localStorage.setItem('prePage', el.id);

  $.append(root, el);

  return () => el.remove();
};

export const customAddEventListener = curry((eventName, f, parent = window) => {
  const handler = () => f();

  parent.addEventListener(eventName, handler);

  return () => parent.removeEventListener(eventName, handler);
});

export const customSetInterval = curry((time, f) => {
  const handler = window.setInterval(f, time);

  return () => window.clearInterval(handler);
});

export const processingMemoryData = memoryData => {
  const mapping = {
    [memoryInfoEnum.TOTAL_MEM_MB]: 'Total',
    [memoryInfoEnum.USED_MEM_MB]: 'Used',
    [memoryInfoEnum.FREE_MEM_MB]: 'Free',
    [memoryInfoEnum.USED_MEM_PERCENTAGE]: 'Usage %',
    [memoryInfoEnum.FREE_MEM_PERCENTAGE]: 'Free %',
    [memoryInfoEnum.APP_MB]: 'App',
    [memoryInfoEnum.COMPRESSED_MB]: 'Compressed',
    [memoryInfoEnum.WIRED_MB]: 'Wired',
  };

  const newObj = {};

  _.go(
    memoryData,
    _.iterObjKey(([key, value]) => {
      if (
        key === memoryInfoEnum.USED_MEM_PERCENTAGE
        || key === memoryInfoEnum.FREE_MEM_PERCENTAGE) {
        newObj[mapping[key]] = value;
      } else {
        newObj[mapping[key]] = parseFloat((value / 1024).toFixed(2));
      }
    }),
  );

  return newObj;
};

export const padTo2Digits = num => String(num).padStart(2, '0');

export const makeTimeFormat = milliseconds => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds,
  )}`;
};
