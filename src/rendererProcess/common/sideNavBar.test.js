import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event'
import './sideNavBar';

jest.mock('../util', () => ({
  ...jest.requireActual('../util'),
  receiveChannel: () => () => jest.fn(),
}));

describe('Nav Bar List', () => {
  test('home, cpu, memory, process, disk, Stats 가 있어야 합니다.', () => {
    const navContainer = document.querySelector('.side-nav-bar-wrapper');

    const navList = ['home', 'cpu', 'memory', 'process', 'disk', 'stats'];

    [...navContainer.children].forEach((el, index) => {
      expect(el.id).toEqual(navList[index]);
    });
  });
})

describe('Nav Bar Test', () => {
  test('초기 화면은 홈페이지가 렌더링 됩니다.', async () => {
    const homePageContainer = document.querySelector('.homePage');

    expect(homePageContainer).not.toBeNull();
  });

  describe('nav 클릭시 해당 페이지가 있는 container dom이 렌더링 되야합니다.', () => {
    test('CPU click', async () => {
      const cpuNav = screen.getByText('CPU');

      await userEvent.click(cpuNav);

      const homePageContainer = document.querySelector('.homePage');
      expect(homePageContainer).toBeNull();

      const cpuPageContainer = document.querySelector('.cpuPage');
      expect(cpuPageContainer).not.toBeNull();
    });

    test('memory click', async () => {
      const memoryNav = screen.getByText('Memory');

      await userEvent.click(memoryNav);

      const cpuPageContainer = document.querySelector('.cpuPage');
      expect(cpuPageContainer).toBeNull();

      const memoryContainer = document.querySelector('.memoryPage');
      expect(memoryContainer).not.toBeNull();
    });

    test('Process: jest-dom에서의 svg태그 미지원 이슈(duration)로 process페이지는 생략합니다.', () => {});

    test('Disk: svg태그 이슈로 생략', () => {});
    test('stats: svg태그 이슈로 생략', () => {});
  });
});
