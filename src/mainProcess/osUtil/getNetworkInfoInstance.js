import os from 'os';
import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';

class NetWork {
  static getNetWork(interfaces) {
    return _.flatten(_.go(
      Object.keys(interfaces),
      L.map(key => _.go(
        interfaces[key],
        _.filter(network => (network.family === 'IPv4' && !network.internal)),
      )),
      L.filter(arr => arr.length),
    ))[0];
  }

  constructor() {
    this.networkInterfaces = os.networkInterfaces();
    this.network = NetWork.getNetWork(this.networkInterfaces);
  }

  getIp() {
    return this?.network?.address ?? '';
  }
}

const getNetworkInfoInstance = makeSingleTonFactory(NetWork);

export default getNetworkInfoInstance;
