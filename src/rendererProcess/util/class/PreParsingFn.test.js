import _ from '../../../lib/fp';
import PreParsingFn from './PreParsingFn';

describe('PreParsingFn 생성자 테스트', () => {
  test('전처리 과정 함수들을 등록하면 구독자들한테 처리가된 데이터를 보내준다.', () => {
    const fn1 = data => data + 1;
    const fn2 = data => data * 2;
    const fn3 = data => data + 2;

    const perParsingFn = new PreParsingFn(fn1);

    perParsingFn.insertPreFn(fn2, fn3);

    const receiveDataList = [];

    const receiveDataAndPushToList = data => {
      receiveDataList.push(data);
    };

    perParsingFn.subscribe(receiveDataAndPushToList);

    const data = 123;
    const afterParsingData = _.go(data, fn1, fn2, fn3);

    perParsingFn.sendParsingData(data);
    perParsingFn.sendParsingData(data);

    expect(receiveDataList.length).toBe(2);
    expect(receiveDataList[0]).toEqual(afterParsingData);
  });
});
