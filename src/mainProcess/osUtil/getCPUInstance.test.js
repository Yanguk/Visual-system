import getCPUInstance from './getCPUInstance';

describe('CpuInfo Class Test', () => {
  test('설정된 인터벌마다 notify 함수를 실행 시킵니다.', async () => {
    jest.useFakeTimers();

    const cpuInfo = getCPUInstance();

    const spyNotify = jest.spyOn(cpuInfo, 'notify')

    const interval = 500;

    cpuInfo.startInterval(interval);

    jest.advanceTimersByTime(interval);
    expect(spyNotify).toBeCalledTimes(1);
    jest.advanceTimersByTime(interval);
    expect(spyNotify).toBeCalledTimes(2);

    cpuInfo.removeInterval();

    jest.advanceTimersByTime(interval);
    expect(spyNotify).toBeCalledTimes(2);
  });
});
