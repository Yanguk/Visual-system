import './index.scss';

import _ from '../../../lib/fp';
import { curry, push, shift } from '../../../lib/fp/util';
import $ from '../../../lib/simpleDom';
import getCPUInfo from '../../osUtil/getCPUInfo';
import drawGraphAndGetClear from '../../components/common/graph';
import { graphEnum } from '../../../lib/constant';

const data = new Array(50).fill(1);

const pushAndShift = curry((...rest) => {
  _.each(f => f(...rest), [push, shift]);
});

const cpuInfo = getCPUInfo();

cpuInfo.on('interval', cpu => {
  pushAndShift(data, cpu.getUsagePercentage() || 1);
});

const root = $.qs('#root');

const renderHomePage = () => {
  const template = `
    <div class="container homePage">
      <div class="home_cpu item">
        <div class="svg_wrapper"></div>
      </div>
      <div class="home_userInfo item">userInfo</div>
      <div class="home_temperature item">temperature</div>
      <div class="home_memory item">memory</div>
      <div class="home_process item">process</div>
    </div>
  `;

  const container = $.append(root, $.el(template));
  const cpuWrapper = $.find('.svg_wrapper', container);

  // toDo: 상세 옵선 수정 필요
  const config = {
    [graphEnum.SIZE]: [cpuWrapper.offsetWidth, cpuWrapper.offsetHeight],
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: 'hotpink',
    [graphEnum.ON_LOAD]: _.each(f => cpuInfo.on('interval', f)),
    [graphEnum.ON_UNMOUNT]: _.each(f => cpuInfo.removeListener('interval', f)),
  };

  const graphClear = drawGraphAndGetClear(data, cpuWrapper, config);

  const clear = () => {
    graphClear();
    container.remove();
  };

  return clear;
};

export default renderHomePage;
