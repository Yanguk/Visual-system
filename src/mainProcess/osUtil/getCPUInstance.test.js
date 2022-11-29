import { makePercentage } from '../../lib/fp/util';
import getCPUInstance, { CPUInfo } from './getCPUInstance';

describe('CpuInfo Class Test', () => {
  test('설정된 인터벌마다 notify 함수를 실행 시킵니다.', async () => {
    jest.useFakeTimers();

    const cpuInfo = getCPUInstance();

    const spyNotify = jest.spyOn(cpuInfo, 'notify')

    const INTERVAL = 500;

    cpuInfo.startInterval(INTERVAL);

    jest.advanceTimersByTime(INTERVAL);
    expect(spyNotify).toBeCalledTimes(1);
    jest.advanceTimersByTime(INTERVAL);
    expect(spyNotify).toBeCalledTimes(2);

    cpuInfo.removeInterval();

    jest.advanceTimersByTime(INTERVAL);
    expect(spyNotify).toBeCalledTimes(2);
  });

  test('interval이 두번 이상 실행되면 에러를 뿜습니다.', () => {
    try {
      const cpuInfo = getCPUInstance();

      cpuInfo.startInterval(500);
      cpuInfo.startInterval(500);
    } catch (err) {
      expect(err.message).toBe('interval is already existed');
    }
  });

  test('CPUInfo.getCPUTotal, cpu사용량 수치의 총합을 계산 해줍니다.', () => {
    const testCPUInfo = [
      {
        times: { idle: 100, user: 200, sys: 300 },
      },
      {
        times: { idle: 10, user: 20, sys: 30 },
      },
    ];

    const idleSum = testCPUInfo.reduce((acc, cur) => acc + cur.times.idle, 0);
    const total = testCPUInfo.reduce(
      (acc, cur) =>
        acc + Object.values(cur.times).reduce((acc, cur) => acc + cur),
      0,
    );

    const result = {
      idleSum,
      total,
    };

    const targetCPUTotal = CPUInfo.getCPUTotal(testCPUInfo);

    expect(targetCPUTotal).toEqual(result);
  });

  test('cpuInfo.getTotalUsagePercentage, 이전 누적사용량과 현재 누적사용량을 비교하여서 현재 사용량의 평균을 %로 나타내줍니다.', () => {
    const preCPUAccInfo = [
      {
        times: { idle: 100, user: 200, sys: 300 },
      },
      {
        times: { idle: 10, user: 20, sys: 30 },
      },
    ];

    const curCPUAccInfo = [
      {
        times: { idle: 200, user: 300, sys: 400 },
      },
      {
        times: { idle: 20, user: 30, sys: 50 },
      },
    ];

    const testData = [preCPUAccInfo, curCPUAccInfo];

    const cpuInfo = new CPUInfo();
    cpuInfo.data = testData;

    const preAccTotal = CPUInfo.getCPUTotal(preCPUAccInfo);
    const curAccTotal = CPUInfo.getCPUTotal(curCPUAccInfo);
    const curTotal = {
      idle: curAccTotal.idleSum - preAccTotal.idleSum,
      total: curAccTotal.total - preAccTotal.total,
    };

    const curPercentage = makePercentage(2, 1 - curTotal.idle / curTotal.total);

    const targetResult = cpuInfo.getTotalUsagePercentage();
    expect(curPercentage).toEqual(targetResult);
  });
});
