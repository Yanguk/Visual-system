import { makeComponent } from '../../util';
import $ from '../../../lib/simpleDom';

const root = $.qs('#root');

const renderProcessPage = makeComponent(onMount => {
  const template = `
    <div class="gridContainer homePage">
      <button>Test</button>
    </div>
  `;

  const container = $.append(root, $.el(template));
  const button = $.qs('button', container);

  button.addEventListener('click', async () => {
    // toDo: api test 장소
    const processList = await window.api.processList(200);
    // eslint-disable-next-line no-console
    console.log(processList);

    const memoryDetail = await window.api.memoryDetail();
    // eslint-disable-next-line no-console
    console.log(memoryDetail);
  });

  onMount(() => container.remove());
});

export default renderProcessPage;
