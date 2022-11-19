import { channelEnum, colorInfo } from '../../lib/constant';
import $ from '../../lib/simpleDom';
import Toast from '../common/Toast';
import { makeComponent, receiveChannel, renderDom } from '../util';

const memoryDataList = [];

const intervalUpdateMemory = memoryData => {
  memoryDataList.push(memoryData);

  if (memoryDataList.length > 50) {
    memoryDataList.shift();
  }
};

const onMemoryUsageEvent = receiveChannel(channelEnum.MEMORY.DETAIL);
onMemoryUsageEvent(intervalUpdateMemory);

const renderMemoryPage = makeComponent(onMount => {
  const template = `
    <div class="memoryPage">
    <button class="test">Test</button>
    </div>
  `;

  const container = $.el(template);
  onMount(renderDom(container));

  const toastElement = new Toast();
  $.qs('.test').addEventListener('click', async () => {
    const memoryDetail = await window.api.memoryDetail();
    toastElement.render('테스트', colorInfo.green2);
    // eslint-disable-next-line no-console
    console.log(memoryDetail);
  });
});

export default renderMemoryPage;
