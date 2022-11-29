import delay from './delay';

test('time 만큼 기다려야함', async () => {
  jest.useFakeTimers();

  const spy = jest.fn();

  delay(100).then(spy);

  jest.advanceTimersByTime(20);
  await Promise.resolve();
  expect(spy).not.toHaveBeenCalled();

  jest.advanceTimersByTime(80);
  await Promise.resolve();
  expect(spy).toHaveBeenCalled();
});
