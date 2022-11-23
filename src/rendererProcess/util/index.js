import { DOMAIN_TIME_DIFF, memoryInfoEnum } from '../../lib/constant';
import _, { makeOnMount } from '../../lib/fp';
import { curry } from '../../lib/fp/util';
import $ from '../../lib/simpleDom';

const root = $.qs('#root');

export const receiveChannel = channel => window.connect.on(channel);

export const makeComponent = renderFn => (...rest) => {
  const [onMount, clearEvent] = makeOnMount();

  renderFn(onMount, ...rest);

  return clearEvent;
};

export const getTimeDomain = () => {
  const t = Date.now();
  const domain = [t - DOMAIN_TIME_DIFF, t];
  return domain;
};

export const insertData = curry((arr, data) => {
  const info = { data, date: new Date() };

  arr.push(info);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.date && (arr[i].date <= new Date(info.date - DOMAIN_TIME_DIFF + 100))) {
      arr.shift();
    } else {
      break;
    }
  }
});

export const renderDom = el => {
  window.localStorage.setItem('prePage', el.id);

  $.append(root, el);
  return () => el.remove();
};

export const customAddEventListener = (eventName, f, parent = window) => {
  const handler = () => f();

  parent.addEventListener(eventName, handler);

  return () => parent.removeEventListener(eventName, handler);
};

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

const padTo2Digits = num => String(num).padStart(2, '0');

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
