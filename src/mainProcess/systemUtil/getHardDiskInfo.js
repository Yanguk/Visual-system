import { COMMAND } from '../../lib/constant';
import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import {
  add, convertKbToGb, isNum, trimAndMakeArr,
} from '../../lib/fp/util';

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

class HardDiskInfo {
  static getHardDiskInfo = async function diskInfo() {
    const { stdout, stderr } = await exec(COMMAND.DISK);

    if (stderr) {
      // eslint-disable-next-line no-console
      console.error(stderr);

      return new Error(stderr);
    }

    const diskList = _.go(
      stdout.split('\n'),
      _.map(trimAndMakeArr),
    ).slice(1);

    const total = convertKbToGb(diskList[0][1]);

    const used = _.go(
      diskList,
      L.filter(info => (info[info.length - 1] === '/System/Volumes/Data') || (info[info.length - 1] === '/')),
      L.map(info => Number(info[2])),
      L.filter(isNum),
      L.map(convertKbToGb),
      _.reduce(add),
    );

    const free = total - used;

    return {
      total,
      used,
      free,
    };
  };

  static getHardDiskInfoAll = async function allInfo() {
    const { stdout, stderr } = await exec(COMMAND.DISK);

    if (stderr) {
      // eslint-disable-next-line no-console
      console.error(stderr);

      return new Error(stderr);
    }

    const [headList, ...diskList] = _.go(
      stdout.split('\n'),
      _.map(trimAndMakeArr),
    );

    const lastText = headList.pop();
    headList[headList.length - 1] = `${headList[headList.length - 1]} ${lastText}`;

    const filteredDiskList = _.filter(info => info[0].includes('/'), diskList);

    return {
      headList,
      filteredDiskList,
    };
  };
}

export default HardDiskInfo;
