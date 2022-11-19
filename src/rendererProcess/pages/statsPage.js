import { colorInfo } from '../../lib/constant';
import $ from '../../lib/simpleDom';
import Toast from '../common/Toast';
import { makeComponent, renderDom } from '../util';

const renderStatsPage = makeComponent(onMount => {
  const template = `
    <div class="statsContainer">
      <button class="test">Test</button>
    </div>
  `;

  const container = $.el(template);
  onMount(renderDom(container));

  const toastElement = new Toast();
  $.qs('.test').addEventListener('click', async () => {
    // eslint-disable-next-line no-shadow
    const processList = await window.api.processList(200);
    // eslint-disable-next-line no-console
    console.log(processList);
    const memoryDetail = await window.api.memoryDetail();
    toastElement.render('테스트', colorInfo.green2);
    // eslint-disable-next-line no-console
    console.log(memoryDetail);
  });
});

export default renderStatsPage;
