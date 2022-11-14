import './index.scss';

import _ from '../../../lib/fp';
import { curry, push, shift } from '../../../lib/fp/util';
import $ from '../../../lib/simpleDom';
import drawGraphAndGetClear from '../../components/common/realTimeGraph';
import { channelEnum, graphEnum } from '../../../lib/constant';
import { receiveChannel } from '../../util';

const cpuData = new Array(51).fill(1);
const memoryData = new Array(51).fill(1);

const pushAndShift = curry((...rest) => {
  _.each(f => f(...rest), [push, shift]);
});

const intervalUpdateCPU = pushAndShift(cpuData);
const intervalUpdateMemory = pushAndShift(memoryData);

window.connect.on(channelEnum.CPU.USAGE, intervalUpdateCPU);
window.connect.on(channelEnum.MEMORY.USAGE, intervalUpdateMemory);

const root = $.qs('#root');

const renderHomePage = () => {
  const template = `
    <div class="container homePage">
      <div class="home_cpu item">
        <p>cpu</p>
        <div class="svg_wrapper"></div>
      </div>
      <div class="home_userInfo item">userInfo</div>
      <div class="home_temperature item">temperature</div>
      <div class="home_memory item">memory
        <div class="svg_wrapper"></div>
      </div>
      <div class="home_process item">process</div>
    </div>
  `;

  const container = $.append(root, $.el(template));
  const cpuWrapper = $.find('.svg_wrapper', container);

  // toDo: 상세 옵선 수정 필요
  const cpuConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: 'hotpink',
    [graphEnum.INTERVAL]: receiveChannel(channelEnum.CPU.USAGE),
  };

  const cpuGraphClear = drawGraphAndGetClear(cpuData, cpuWrapper, cpuConfig);

  const memoryWrapper = $.find('.home_memory > .svg_wrapper', container);

  const memoryConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: 'hotpink',
    [graphEnum.INTERVAL]: receiveChannel(channelEnum.MEMORY.USAGE),
  };

  const memoryGraphClear = drawGraphAndGetClear(
    memoryData,
    memoryWrapper,
    memoryConfig,
  );

  const clear = () => {
    cpuGraphClear();
    memoryGraphClear();
    container.remove();
  };

  return clear;
};

export default renderHomePage;
