import getMemoryInstance, { MemoryInfo } from './getMemoryInstance';
import os from 'os';

jest.mock('../../lib/cumulativeAverage', () => jest.fn);

describe('MemoryInfo Class Test', () => {
  test('설정된 인터벌마다 데이터를 얻습니다.', async () => {
    jest.useFakeTimers();

    const memoryInfo = getMemoryInstance();

    const spyGetMemoryDetail = jest.spyOn(MemoryInfo, 'getMemoryDetail');

    const interval = 500;

    memoryInfo.startInterval(interval);

    jest.advanceTimersToNextTimer();
    jest.advanceTimersToNextTimer();

    expect(spyGetMemoryDetail).toBeCalledTimes(2);

    memoryInfo.removeInterval();

    jest.advanceTimersToNextTimer();
    jest.advanceTimersToNextTimer();

    expect(spyGetMemoryDetail).toBeCalledTimes(2);
  });

  test('getFreeAndTotalInfo, os모듈로 얻을수있는 free, total 값이 나와야합니다.', () => {
    const spyFree = jest.spyOn(os, 'freemem');
    const spyTotal = jest.spyOn(os, 'totalmem');

    MemoryInfo.getFreeAndTotalInfo();

    expect(spyFree).toBeCalledTimes(1);
    expect(spyTotal).toBeCalledTimes(1);
  });

  test('getMemoryDetail의 결과값 목록 확인하기', async () => {
    const memoryDetailObjEnum = {
      Total_MEM_MB: 'totalMemMb',
      USED_MEM_MB: 'usedMemMb',
      FREE_MEM_MB: 'freeMemMb',
      USED_MEM_PERCENTAGE: 'usedMemPercentage',
      FREE_MEM_PERCENTAGE: 'freeMemPercentage',
      COMPRESSED_MB: 'compressedMb',
      WIRED_MB: 'wiredMb',
      APP_MB: 'appMb',
    };

    const detailObj = await MemoryInfo.getMemoryDetail();

    Object.values(memoryDetailObjEnum).forEach(item => {
      const isInItem = item in detailObj;

      expect(isInItem).toBeTruthy();
    });
  });
});
