import { makeOnMount } from '../../lib/fp';

export const receiveChannel = channel => window.connect.on(channel);

export const makeComponent = renderFn => (...rest) => {
  const [onMount, clearEvent] = makeOnMount();

  renderFn(onMount, ...rest);

  return clearEvent;
};
