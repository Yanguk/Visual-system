import delay from '../../lib/delay';
import renderCPUPage from "./cpuPage"

describe('cpuPage Render', () => {
  const clearPage = renderCPUPage();

  test('cpu Render()', async () => {
    await delay(0);

    const cpuPageContainer = document.querySelector('.cpuPage');

    expect(cpuPageContainer).not.toBeNull();
  });

  test('cpu unMount', () => {
    clearPage();

    const cpuPageContainer = document.querySelector('.cpuPage');

    expect(cpuPageContainer).toBeNull();
  });
});
