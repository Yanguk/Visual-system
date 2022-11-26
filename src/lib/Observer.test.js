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
  })
});
