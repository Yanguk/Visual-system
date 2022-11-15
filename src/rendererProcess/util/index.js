import _ from '../../lib/fp';

// eslint-disable-next-line import/prefer-default-export
export const receiveChannel = channel => {
  const channelOnEvent = window.connect.on(channel);

  return (...rest) => _.map(channelOnEvent, rest);
};
