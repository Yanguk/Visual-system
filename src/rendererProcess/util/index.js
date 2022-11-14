import _ from '../../lib/fp';

// eslint-disable-next-line import/prefer-default-export
export const receiveChannel = channel => _.map(window.connect.on(channel));
