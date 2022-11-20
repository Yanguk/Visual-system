import { colorInfo } from '../../lib/constant';
import $ from '../../lib/simpleDom';
import Toast from '../common/Toast';
import { makeComponent, renderDom } from '../util';

const renderDiskPage = makeComponent(onMount => {
  const template = `
    <div class="diskPageContainer" id="disk">
      <div class="diskPageWrapper">
      </div>
      <button class="test">Test</button>
    </div>
  `;

  const container = $.el(template);
  onMount(renderDom(container));

  const toastElement = new Toast();
  $.qs('.test').addEventListener('click', async () => {
    const diskAll = await window.api.diskAll();
    toastElement.render('테스트', colorInfo.green2);
    // eslint-disable-next-line no-console
    console.log(diskAll);
  });
});

export default renderDiskPage;
