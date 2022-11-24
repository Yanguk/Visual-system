import { channelEnum } from '../../lib/constant';
import { screen } from '@testing-library/dom';
import renderHomePage from './homePage';

const channelList = [];

jest.mock('../util', () => ({
  ...jest.requireActual('../util'),
  receiveChannel: (channel) => {
    channelList.push(channel);

    return () => jest.fn();
  },
}));

describe('homePage Test', () => {
  const clearPage = renderHomePage();

  describe('홈페이지가 렌더링 되어야 합니다.', () => {
    test('homePageContainer render', () => {
      const homePageContainer = document.querySelector('.homePage');

      expect(homePageContainer).not.toBeNull();
    });

    test('cpu section render', () => {
      expect(screen.getByText(/CPU usage/)).toBeInTheDocument();
    });

    test('memory section render', () => {
      expect(screen.getByText(/Memory usage:/)).toBeInTheDocument();
    });

    test('disk section render', () => {
      expect(screen.getByText(/Disk:/)).toBeInTheDocument();
    });

    test('process section render', () => {
      expect(screen.getByText(/Process List/)).toBeInTheDocument();
    });
  });

  test('Page unMount Test', () => {
    clearPage();

    const homePageContainer = document.querySelector('.homePage');

    expect(homePageContainer).toBeNull();
  });

  test('등록된 채널 갯수는 3개로 cpu, memory, process가 있습니다.', () => {
    const originChannelList = [
      channelEnum.CPU.ALL_USAGE,
      channelEnum.MEMORY.USAGE,
      channelEnum.PROCESS.List
    ];

    for (const channel of originChannelList) {
      expect(channelList.indexOf(channel) > 0).toBeTruthy;
    }
  });
});
