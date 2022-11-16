import { DOMAIN_TIME_DIFF } from '../../lib/constant';
import { makeOnMount, pushAndShift } from '../../lib/fp';

export const receiveChannel = channel => window.connect.on(channel);

export const makeComponent = renderFn => (a, b, c) => {
  const [onMount, clearEvent] = makeOnMount();

  renderFn(onMount, a, b, c);

  return clearEvent;
};

export const getTimeDomain = () => {
  const t = Date.now();
  const domain = [t - DOMAIN_TIME_DIFF, t];
  return domain;
};

export const insertData = arr => {
  let isMaxLength = false;

  return data => {
    const info = { data, date: new Date() };

    if (isMaxLength) {
      pushAndShift(arr, info);
      return;
    }

    if (arr[0]?.date && (arr[0].date < new Date(info.date - DOMAIN_TIME_DIFF))) {
      isMaxLength = true;
    } else {
      arr.push(info);
    }
  };
};
