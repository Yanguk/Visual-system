import getMemoryInstance, { MemoryInfo } from './getMemoryInstance';

jest.mock('../../lib/cumulativeAverage', () => jest.fn);

describe('MemoryInfo Class Test', () => {
  test('설정된 인터벌마다 데이터를 얻습니다.', async () => {
    jest.useFakeTimers();

    const memoryInfo = getMemoryInstance();

    const spyGetMemoryDetail = jest.spyOn(MemoryInfo, 'getMemoryDetail');

    const interval = 500;

    memoryInfo.startInterval(interval);

    jest.advanceTimersToNextTimer();

    expect(spyGetMemoryDetail).toBeCalledTimes(1);

    memoryInfo.removeInterval();
  });
});
