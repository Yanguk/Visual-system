import customExec from './customExec';

describe('customExec Test', () => {
  it('터미널 명령어를 실행시킵니다.', async () => {
    const testWord = 'hello Visual System'
    const result = await customExec(`echo ${testWord}`);

    expect(result.trim()).toBe(testWord);
  });

  it('존재하지 않는명령어 일때 에러를 뿜습니다.', async () => {
    try {
      const command = 'abcdefghijk123';
      await customExec(command);
    } catch (err) {
      expect(err.message.includes('not found')).toBeTruthy();
    }
  });
});
