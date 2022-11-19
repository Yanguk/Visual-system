import { DOMAIN_TIME_DIFF } from '../../lib/constant';
import { makeOnMount } from '../../lib/fp';
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
