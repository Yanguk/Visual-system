import L from './lazy';
import _ from './underDash';

describe('lazy 함수 테스트', () => {
  describe('bind 함수 테스트', () => {
    test('두개의 이터레이터를 바인드하면 결합된 이중배열이 되어야합니다.', () => {
      const a = [...L.range(10)];
      const b = [...L.range(10, 23)];

      const c = [...L.bind(b, a)];

      expect(c).toStrictEqual([
        [ 0, 10 ], [ 1, 11 ],
        [ 2, 12 ], [ 3, 13 ],
        [ 4, 14 ], [ 5, 15 ],
        [ 6, 16 ], [ 7, 17 ],
        [ 8, 18 ], [ 9, 19 ]
      ]);
    });
  });

  describe('take 함수 테스트', () => {
    test('주어진 limit 갯수 만큼만 배열로 뽑아냅니다.', () => {
      const a = L.range(20);

      const limit = 10;

      const result = [...L.take(limit, a)].length;

      expect(result).toBe(limit);
    });
  });
});
