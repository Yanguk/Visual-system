import makeSingleTonFactory from './makeSingleTonFactory';

describe('오직 하나의 인스턴스만 존재해야 합니다.', () => {
  class TestClass {
    constructor() {}
  }

  test('testClass Instance 비교하기', () => {
    const test1 = new TestClass();
    const test2 = new TestClass();

    expect(test1 === test2).toBeFalsy()

    const getSingleTonTest = makeSingleTonFactory(TestClass);

    const test3 = getSingleTonTest();
    const test4 = getSingleTonTest();

    expect(test3 === test4).toBeTruthy();
  })
});
