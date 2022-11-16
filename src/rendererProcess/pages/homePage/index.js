/* eslint-disable no-console */
import './index.scss';

import _ from '../../../lib/fp';
import $ from '../../../lib/simpleDom';
import drawGraphAndGetClear from '../../common/realTimeGraph';
import { channelEnum, graphEnum, GRAPH_COLOR } from '../../../lib/constant';
import { insertData, makeComponent, receiveChannel } from '../../util';
import { curry } from '../../../lib/fp/util';

const cpuData = [];
const memoryData = [];

const intervalUpdateCPU = insertData(cpuData);
const intervalUpdateMemory = insertData(memoryData);

const onCPUUsageEvent = receiveChannel(channelEnum.CPU.USAGE);
const onMemoryUsageEvent = receiveChannel(channelEnum.MEMORY.USAGE);

onCPUUsageEvent(intervalUpdateCPU);
onMemoryUsageEvent(intervalUpdateMemory);

const root = $.qs('#root');

const renderHomePage = makeComponent(onMount => {
  const template = `
    <div class="gridContainer homePage">
      <article class="home_cpu item">
        <p>CPU usage: <span class="cpu_usage text"></span></p>
        <div class="svg_wrapper"></div>
      </article>
      <article class="home_userInfo item">userInfo</article>
      <article class="home_temperature item">위에 유저정보 추가하고 여기 disk 요약 정리칸</article>
      <article class="home_memory item">
        <p>free Memory: <span class="memory_usage text"></span></p>
        <div class="svg_wrapper"></div>
      </article>
      <article class="home_process item">process</article>
    </div>
  `;

  const container = $.append(root, $.el(template));
  onMount(() => container.remove());

  const changeUsageText = curry((el, data) => {
    el.textContent = `${data}%`;
  });

  const classList = {
    CPU_USAGE: '.cpu_usage',
    MEMORY_USAGE: '.memory_usage',
  };

  const cpuTextEl = $.qs(classList.CPU_USAGE, container);
  const memoryEl = $.qs(classList.MEMORY_USAGE, container);

  onMount(onCPUUsageEvent(changeUsageText(cpuTextEl)));
  onMount(onMemoryUsageEvent(changeUsageText(memoryEl)));

  const cpuWrapper = $.find('.svg_wrapper', container);

  const cpuConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.INTERVAL]: onCPUUsageEvent,
  };

  onMount(drawGraphAndGetClear(cpuData, cpuWrapper, cpuConfig));

  const memoryWrapper = $.find('.home_memory > .svg_wrapper', container);
  const memoryConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.INTERVAL]: onMemoryUsageEvent,
  };

  onMount(drawGraphAndGetClear(
    memoryData,
    memoryWrapper,
    memoryConfig,
  ));

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
});

export default renderHomePage;
