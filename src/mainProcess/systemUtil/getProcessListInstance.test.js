import getProcessListInstance, { ProcessInfo } from './getProcessListInstance';

describe('ProcessInfo Class Test', () => {
  test('processList 가져오기', async () => {
    const listCount = 20;

    const processList = await ProcessInfo.getProcessList(listCount);

    expect(processList.length).toEqual(listCount);
  });
});

describe('CpuInfo Class Test', () => {
  test('설정된 인터벌마다 데이터를 가져옵니다.', async () => {
    jest.useFakeTimers();

    const processInfo = new ProcessInfo();

    const spyGetProcessList = jest.spyOn(ProcessInfo, 'getProcessList')

    const interval = 500;

    processInfo.startInterval(interval);

    jest.advanceTimersByTime(interval);
    expect(spyGetProcessList).toBeCalledTimes(1);
    jest.advanceTimersByTime(interval);
    expect(spyGetProcessList).toBeCalledTimes(2);

    processInfo.removeInterval();

    jest.advanceTimersByTime(interval);
    expect(spyGetProcessList).toBeCalledTimes(2);
  });
});
