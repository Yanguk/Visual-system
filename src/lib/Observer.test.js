import Observer from './Observer';

describe('Observer Class Test', () => {
  test('옵저버 구독후 알람을 제대로 받을수 있는지 테스트', () => {
    const observer = new Observer();

    const testChannelFn = jest.fn();
    const test2ChannelFn = jest.fn();

    observer.on('test', testChannelFn);
    observer.on('test2', test2ChannelFn);

    const value = 'good';

    observer.notify('test', value);
    observer.notify('test', value);

    expect(testChannelFn.mock.calls[0][0]).toBe(value);
    expect(testChannelFn.mock.calls.length).toBe(2);
    expect(test2ChannelFn.mock.calls.length).toBe(0);

    observer.notify('test2', value);
    observer.notify('test2', value);

    expect(testChannelFn.mock.calls[0][0]).toBe(value);
    expect(testChannelFn.mock.calls.length).toBe(2);
    expect(test2ChannelFn.mock.calls[0][0]).toBe(value);
    expect(test2ChannelFn.mock.calls.length).toBe(2);
  });

  test('옵저버 구독 취소 테스트', () => {
    const targetFn = jest.fn();

    const observer = new Observer();

    observer.on('test', targetFn);

    observer.notify('test');
    observer.notify('test');
    observer.notify('test');

    expect(targetFn).toBeCalledTimes(3);

    observer.removeListener('test', targetFn);

    observer.notify('test');
    observer.notify('test');
    observer.notify('test');

    expect(targetFn).toBeCalledTimes(3);
  });

  test('구독 취소시 존재하지 않는 함수 였으면 아무일도 하지않음', () => {
    const test = jest.fn();

    const observer = new Observer();

    const result = observer.removeListener('test', test);

    expect(result).toBeUndefined();
  });
});
