import cumulativeAverage from './cumulativeAverage';

test('평균 필터 알고리즘 테스트', () => {
  const test = [1, 2, 3, 4, 5];
  const average = test.reduce((a, b) => a + b) / test.length;

  const newData = 6;

  const targetAverage = cumulativeAverage(average, newData, test.length + 1);

  test.push(newData);
  const originAverage = test.reduce((a, b) => a + b) / test.length;

  expect(targetAverage).toEqual(originAverage);
});
