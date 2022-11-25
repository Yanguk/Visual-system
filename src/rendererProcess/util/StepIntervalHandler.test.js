import StepIntervalHandler from "./StepIntervalHandler";

describe('StepIntervalHandler Test', () => {
  it('step이 3일때 update함수가 3번실행될때마다 등록된 함수들을 실행시킴', () => {
    const step = 3;
    const stepIntervalHandler = new StepIntervalHandler(step);

    const fn1 = jest.fn();
    const fn2 = jest.fn();

    stepIntervalHandler.insert(fn1);
    stepIntervalHandler.insert(fn2);

    const data = 'TestData';

    stepIntervalHandler.update(data);
    stepIntervalHandler.update(data);
    stepIntervalHandler.update(data);

    stepIntervalHandler.update(data);
    stepIntervalHandler.update(data);
    stepIntervalHandler.update(data);

    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(2);
    expect(fn1.mock.lastCall[0]).toBe(data);
  })
});
