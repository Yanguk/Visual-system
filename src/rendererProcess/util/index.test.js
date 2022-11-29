import { makeTimeFormat, padTo2Digits } from ".";

describe('rendererProcess util함수들 테스트', () => {
  test('padTo2Digits, 숫자가 1글자면 앞에 0을 붙혀줍니다.', () => {
    const testNum = 1;
    const testResult = '01';

    expect(padTo2Digits(testNum)).toEqual(testResult);
  });

  test('makeTimeFormat, millisecond를 받아서 시간 포멧으로 변경해줍니다.', () => {
    const testMillisecond = 1000 * 60 * 60 + 1000 * 60 * 3 + 1000 * 30;
    const resultFormat = '01:03:30';

    expect(makeTimeFormat(testMillisecond)).toEqual(resultFormat);
  });
});
