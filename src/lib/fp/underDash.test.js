import _ from './underDash';
import L from './lazy';

describe('함수들 테스트', () => {
  describe('until 함수', () => {
    test('인자로 넣은 함수의 리턴값이 true일때 까지만 iterator를 순회합니다.', () => {
      const testIterator1 = L.range(100);
      const testIterator2 = L.range(100);

      const testFn = item => item === 5;

      const result = _.until(testFn, testIterator1);

      expect(result).toStrictEqual(_.range(5));

      const result2 = _.go(
        testIterator2,
        _.until(testFn),
      );

      expect(result).toStrictEqual(result2);
    });
  });

  describe('notUntil 함수', () => {
    test('인자로 넣은 함수 리턴값이 false일때 까지만 iterator를 순회합니다.', () => {
      const testIterator = _.range(10);

      const testFn = item => item < 5;

      const result = _.notUntil(testFn, testIterator);

      expect(result).toStrictEqual(_.range(5));
    });
  });
});
