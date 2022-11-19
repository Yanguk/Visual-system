import os from 'os';
import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import { makePercentage, push } from '../../lib/fp/util';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import Observer from '../../lib/Observer';
import customExec from './customExec';

export const memoryInfoEnum = {
  TOTAL_MEM_MB: 'totalMemMb',
  USED_MEM_MB: 'usedMemMb',
  FREE_MEM_MB: 'freeMemMb',
  USED_MEM_PERCENTAGE: 'usedMemPercentage',
  FREE_MEM_PERCENTAGE: 'freeMemPercentage',
  COMPRESSED_MB: 'compressedMb',
  WIRED_MB: 'wiredMb',
  APP_MB: 'appMb',
};

export class MemoryInfo extends Observer {
  constructor(window) {
    super();

    this.window = window;
    this.data = [];
    this.interval = null;
  }

  startInterval(time = 500) {
    if (this.interval) {
      return;
    }

    MemoryInfo
      .getMemoryDetail()
      .then(push(this.data));

    this.interval = setInterval(async () => {
      const nextMemoryInfo = await MemoryInfo.getMemoryDetail();

      this.data.push(nextMemoryInfo);

      // toDo: 추후 데이터 저장 로직 작업시 변경 필요
      if (this.data.length === 60) {
        this.data = this.data.slice(-2);
      }

      this.notify('interval', this);
    }, time);
  }

  get lastData() {
    return this.data[this.data.length - 1];
  }

  getFreePercentage() {
    if (this.data.length < 2) {
      return 0;
    }

    const { free, total } = MemoryInfo.getFreeAndTotalInfo();
    const percentage = free / total;

    return makePercentage(2, percentage);
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
}

const getMemoryInstance = makeSingleTonFactory(MemoryInfo);

export default getMemoryInstance;
