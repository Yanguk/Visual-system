import { COMMAND } from '../../lib/constant';
import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import {
  add, convertKbToGb, isNum, trimAndMakeArr,
} from '../../lib/fp/util';
import customExec from '../osUtil/customExec';

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

  static getHardDiskInfoAll = async function allInfo() {
    const stdout = await customExec(COMMAND.DISK);

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
