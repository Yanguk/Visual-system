import os from 'os';

import getNetworkInfoInstance from './getNetworkInfoInstance';
import { convertKbToGb } from '../../lib/fp/util';

const networkInfo = getNetworkInfoInstance();

const getUserInfo = () => {
  const userInfoData = {
    name: os.hostname(),
    ip: networkInfo.getIp(),
    cpu: os.cpus()[0].model,
    memory: convertKbToGb(os.totalmem() / 1024),
    platform: os.platform(),
    arch: os.arch(),
  };

  return userInfoData;
};

export default getUserInfo;
