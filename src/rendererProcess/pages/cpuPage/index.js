import $ from '../../../lib/simpleDom';

const root = $.qs('#root');

const renderCPUPage = () => {
  const template = `
    <div class="container cpuPage">
      <div class="cpu_core1 item">core1</div>
      <div class="cpu_core2 item">core2</div>
      <div class="cpu_core3 item">core3</div>
      <div class="cpu_core4 item">core4</div>
    </div>
  `;

  const container = $.append(root, $.el(template));

  const clear = () => {
    container.remove();
  };

  return clear;
};

export default renderCPUPage;
