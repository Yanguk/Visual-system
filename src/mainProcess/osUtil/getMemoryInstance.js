import os from 'os';

import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import cumulativeAverage from '../../lib/cumulativeAverage';
import { memoryInfoEnum } from '../../lib/constant';
import Observer from '../../lib/Observer';
import customExec from './customExec';
import _ from '../../lib/fp/underDash';
import L from '../../lib/fp/lazy';

export class MemoryInfo extends Observer {
  constructor() {
    super();

    this.interval = null;
    this.data = null;
    this.average = 0;
    this.averageCount = 0;
    this.intervalTime = 0;
  }

  startInterval(time = 500) {
    if (this.interval) {
      return;
    }

    this.intervalTime = time;

    this.interval = setInterval(async () => {
      const nextMemoryInfo = await MemoryInfo.getMemoryDetail();
      this.data = nextMemoryInfo;
      const resultAverage = nextMemoryInfo[memoryInfoEnum.USED_MEM_PERCENTAGE];

      this.average = cumulativeAverage(this.average, resultAverage, ++this.averageCount);

      this.notify('interval', this);
    }, time);
  }

  static getFreeAndTotalInfo() {
    return {
      free: os.freemem(),
      total: os.totalmem(),
    };
  }

  static async getMemoryDetail() {
    const [vmStat, pageAble] = await Promise.all([
      customExec('vm_stat'),
      customExec('sysctl vm.page_pageable_internal_count'),
    ]);

    const [__, pageAbleValue] = pageAble.toString().trim().split(':');
    const vmStatStr = vmStat.toString().trim();
    const matchedPageSize = /page size of (\d+) bytes/.exec(vmStatStr);
    const numMatchedPageSize = Number(matchedPageSize[1]);

    const pageSize = Number.isNaN(numMatchedPageSize)
      ? Number(matchedPageSize[1])
      : 4096;

    const freeAndTotalInfo = MemoryInfo.getFreeAndTotalInfo();

    if (Number.isNaN(Number(pageAbleValue))) {
      return freeAndTotalInfo;
    }

    const numPageAbleValue = Number(pageAbleValue) * pageSize;

    const mappings = {
      'Pages purgeable': 'purgeable',
      'Pages wired down': 'wired',
      'Pages active': 'active',
      'Pages inactive': 'inactive',
      'Pages occupied by compressor': 'compressed',
    };

    const vmStatInfoArr = _.go(
      vmStatStr,
      str => str.split('\n'),
      L.filter(str => str !== ''),
      L.map(str => str.split(':')),
      _.map(_.pipe(
        L.getIndex,
        _.map(([str, idx]) => (idx
          ? str.replace('.', '').trim()
          : str)),
      )),
    );

    const vmStatInfoObj = _.reduce((acc, [key, value]) => {
      const objKey = mappings[key];

      if (!objKey) {
        return acc;
      }

      acc[objKey] = Number(value) * pageSize;
      return acc;
    }, {}, vmStatInfoArr);

    const appMemory = numPageAbleValue - vmStatInfoObj.purgeable;
    const wiredMemory = vmStatInfoObj.wired;
    const compressedMemory = vmStatInfoObj.compressed;
    const used = appMemory + wiredMemory + compressedMemory;
    const totalMem = freeAndTotalInfo.total;
    const freeMem = totalMem - used;

    const parseByteToMb = num => parseFloat((num / 1024 / 1024).toFixed(2));

    const totalMemMb = parseByteToMb(freeAndTotalInfo.total);
    const usedMemMb = parseFloat((totalMemMb - parseByteToMb(freeMem)).toFixed(2));
    const freeMemMb = parseFloat((totalMemMb - usedMemMb).toFixed(2));
    const usedMemPercentage = parseFloat(
      (100 * ((totalMem - freeMem) / totalMem)).toFixed(2),
    );
    const freeMemPercentage = parseFloat((100 * (freeMem / totalMem)).toFixed(2));

    return {
      totalMemMb,
      usedMemMb,
      freeMemMb,
      usedMemPercentage,
      freeMemPercentage,
      compressedMb: parseByteToMb(compressedMemory),
      wiredMb: parseByteToMb(wiredMemory),
      appMb: parseByteToMb(appMemory),
    };
  }

  getPercentageTotalAverage() {
    return {
      time: this.averageCount * this.intervalTime,
      average: this.average,
    };
  }

  removeInterval() {
    clearInterval(this.interval);
  }
}

const getMemoryInstance = makeSingleTonFactory(MemoryInfo);

export default getMemoryInstance;
