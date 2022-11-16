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
    const processList = await window.api.processList();
    // eslint-disable-next-line no-console
    console.log(processList);

    const diskList = await window.api.test();
    // eslint-disable-next-line no-console
    console.log(diskList);
  });

  onMount(() => container.remove());
});

export default renderProcessPage;
