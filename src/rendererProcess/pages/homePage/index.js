/* eslint-disable no-console */
import './index.scss';

import _, { pushAndShift } from '../../../lib/fp';
import $ from '../../../lib/simpleDom';
import drawGraphAndGetClear from '../../common/realTimeGraph';
import { channelEnum, graphEnum } from '../../../lib/constant';
import { receiveChannel } from '../../util';

const cpuData = new Array(51).fill(0);
const memoryData = new Array(51).fill(0);

const intervalUpdateCPU = pushAndShift(cpuData);
const intervalUpdateMemory = pushAndShift(memoryData);

const onCPUUsageEvent = receiveChannel(channelEnum.CPU.USAGE);
const onMemoryUsageEvent = receiveChannel(channelEnum.MEMORY.USAGE);

onCPUUsageEvent(intervalUpdateCPU);
onMemoryUsageEvent(intervalUpdateMemory);

const root = $.qs('#root');

const renderHomePage = () => {
  const template = `
    <div class="gridContainer homePage">
      <article class="home_cpu item">
        <p>cpu</p>
        <div class="svg_wrapper"></div>
      </article>
      <article class="home_userInfo item">userInfo</article>
      <article class="home_temperature item">temperature</article>
      <article class="home_memory item">memory
        <div class="svg_wrapper"></div>
      </article>
      <article class="home_process item">process</article>
    </div>
  `;

  const container = $.append(root, $.el(template));
  const cpuWrapper = $.find('.svg_wrapper', container);

  // toDo: 상세 옵선 수정 필요
  const cpuConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: 'hotpink',
    [graphEnum.INTERVAL]: onCPUUsageEvent,
  };

  const cpuGraphClear = drawGraphAndGetClear(cpuData, cpuWrapper, cpuConfig);

  const memoryWrapper = $.find('.home_memory > .svg_wrapper', container);
  const memoryConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: 'hotpink',
    [graphEnum.INTERVAL]: onMemoryUsageEvent,
  };

  const memoryGraphClear = drawGraphAndGetClear(
    memoryData,
    memoryWrapper,
    memoryConfig,
  );

  const userInfoWrapper = $.find('.home_userInfo', container);

  const asyncWriteInfo = async () => {
    const userInfo = await window.api.userInfo();
    const diskInfo = await window.api.disk();

    const infoEnum = {
      NAME: 'name',
      IP: 'ip',
      CPU: 'cpu',
      MEMORY: 'memory',
      DISK: 'disk',
    };

    const targetInfo = {
      ...userInfo,
      name: userInfo.name.split('.')[0],
      memory: `${userInfo.memory}GB`,
      disk: `${diskInfo.used}GB / ${diskInfo.total}GB`,
    };

    const infoTemplate = _.go(
      Object.keys(infoEnum),
      _.map(type => `
        <p class='infoWrapper'>
          ${infoEnum[type] === 'name' ? '' : `<span class='title'>${infoEnum[type]}: </span> `}
          <span class='info'>${targetInfo[infoEnum[type]]}</span>
        </p>
    `),
    ).join('\n');

    userInfoWrapper.innerHTML = infoTemplate;
  };

  asyncWriteInfo();

  // toDo: 삭제 예정
  userInfoWrapper.addEventListener('click', async () => {
    const a = await window.api.userInfo();
    const b = await window.api.disk();
    console.log(a);
    console.log(b);
  });

  const onMount = () => {
    cpuGraphClear();
    memoryGraphClear();
    container.remove();
  };

  return onMount;
};

export default renderHomePage;
