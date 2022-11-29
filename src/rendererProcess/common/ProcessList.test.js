import { screen } from '@testing-library/dom';
import { ProcessInfo } from '../../mainProcess/systemUtil/getProcessListInstance'
import ProcessList, { processListConfigEnum } from './ProcessList';

describe('processList Test', () => {
  test('processList Render, 전달해준 프로세스 리스트가 화면에 렌더링 되야합니다.', async () => {
    const parentEl = document.querySelector('#root');

    const config = { [processListConfigEnum.SELECT]: false };
    const processList = new ProcessList(parentEl, config);

    const processListData = await ProcessInfo.getProcessList(10);
    processList.render(processListData);

    processListData.forEach((row, i) => {
      if (i === 0) {
        return;
      }

      row.forEach(item => {
        const texts = screen.getAllByText(item);
        expect(texts[0]).toBeInTheDocument();
      });
    });
  });
});
