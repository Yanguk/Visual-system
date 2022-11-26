import { COMMAND } from '../../lib/constant';
import customExec from '../osUtil/customExec';
import _ from '../../lib/fp/underDash';
import L from '../../lib/fp/lazy';
import {
  add, convertKbToGb, isNum, trimAndMakeArr,
} from '../../lib/fp/util';

class HardDiskInfo {
  static getHardDiskInfo = async function diskInfo() {
    const stdout = await customExec(COMMAND.DISK);

    const diskList = _.go(
      stdout.split('\n'),
      _.map(trimAndMakeArr),
    ).slice(1);

    const total = convertKbToGb(diskList[0][1]);

    const used = _.go(
      diskList,
      L.filter(info => info[info.length - 1].includes('/')),
      L.filter(info => info[0].includes('disk')),
      L.map(info => Number(info[2])),
      L.filter(isNum),
      L.map(convertKbToGb),
      _.reduce(add),
    );

    const free = total - used;

    return {
      dir: '/',
      total,
      used,
      free,
    };
  };

  static getHardDiskInfoAllGB = async function allInfo() {
    const stdout = await customExec(COMMAND.DISK_GB);

    const [headList, ...diskList] = _.go(
      stdout.split('\n'),
      _.map(trimAndMakeArr),
    );

    const lastText = headList.pop();
    headList[headList.length - 1] = `${headList[headList.length - 1]} ${lastText}`;

    const filteredDiskList = _.go(
      diskList,
      _.filter(info => info[0].includes('/')),
      _.filter(info => info[0].includes('disk')),
    );

    return {
      headList,
      filteredDiskList,
    };
  };
}

export default HardDiskInfo;
