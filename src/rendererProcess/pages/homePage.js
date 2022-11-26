import ProcessList, { processListConfigEnum } from '../common/ProcessList';
import { channelEnum, graphEnum, GRAPH_COLOR } from '../../lib/constant';
import drawGraphAndGetClear from '../common/realTimeGraph';
import { disk as diskIcon } from '../util/icons';
import { curry } from '../../lib/fp/util';
import _ from '../../lib/fp/underDash';
import $ from '../../lib/simpleDom';
import {
  insertRealTimeGraphData, makeComponent, receiveChannel, renderDom,
} from '../util';

const cpuData = [];
const memoryData = [];

const intervalUpdateCPU = insertRealTimeGraphData(cpuData);
const intervalUpdateMemory = insertRealTimeGraphData(memoryData);

const onCPUUsageEvent = receiveChannel(channelEnum.CPU.USAGE);
const onMemoryUsageEvent = receiveChannel(channelEnum.MEMORY.USAGE);
const onProcessEvent = receiveChannel(channelEnum.PROCESS.List);

onCPUUsageEvent(intervalUpdateCPU);
onMemoryUsageEvent(intervalUpdateMemory);

const renderHomePage = makeComponent(unmount => {
  const template = `
    <div class="gridContainer homePage" id="home">
      <article class="home-cpu item">
        <p>CPU usage: <span class="cpu-usage text"></span></p>
        <div class="svg-wrapper"></div>
      </article>
      <article class="home-userInfo item">userInfo</article>
      <article class="home-disk-info item"></article>
      <article class="home-memory item">
        <p>Memory usage: <span class="memory-usage text"></span></p>
        <div class="svg-wrapper"></div>
      </article>
      <article class="home-process item">
        <fieldset class="table-wrapper">
          <legend>Process List</legend>
        </fieldset>
      </article>
    </div>
  `;

  const container = $.el(template);

  unmount(renderDom(container));

  const changeUsageText = curry((el, data) => {
    el.textContent = `${data}%`;
  });

  const classList = {
    CPU_USAGE: '.cpu-usage',
    MEMORY_USAGE: '.memory-usage',
  };

  const cpuTextEl = $.qs(classList.CPU_USAGE, container);
  const memoryEl = $.qs(classList.MEMORY_USAGE, container);

  unmount(onCPUUsageEvent(changeUsageText(cpuTextEl)));

  unmount(onMemoryUsageEvent(changeUsageText(memoryEl)));

  const cpuWrapper = $.find('.svg-wrapper', container);

  const cpuConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.INTERVAL]: onCPUUsageEvent,
  };

  unmount(drawGraphAndGetClear(cpuData, cpuWrapper, cpuConfig));

  const memoryWrapper = $.find('.home-memory > .svg-wrapper', container);
  const memoryConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.INTERVAL]: onMemoryUsageEvent,
  };

  unmount(drawGraphAndGetClear(
    memoryData,
    memoryWrapper,
    memoryConfig,
  ));

  const userInfoWrapper = $.find('.home-userInfo', container);

  const asyncWriteInfo = async () => {
    const userInfo = await window.api.userInfo();

    const infoEnum = {
      NAME: 'name',
      IP: 'ip',
      CPU: 'cpu',
      MEMORY: 'memory',
      PLATFORM: 'platform',
      ARCH: 'arch',
    };

    const targetInfo = {
      ...userInfo,
      name: userInfo.name.split('.')[0],
      memory: `${userInfo.memory}GB`,
    };

    const infoTemplate = _.go(
      Object.keys(infoEnum),
      _.map(type => `
        <p class='info-wrapper'>
          ${infoEnum[type] === 'name' ? '' : `<span class='title'>${infoEnum[type]}: </span> `}
          <span class='info'>${targetInfo[infoEnum[type]]}</span>
        </p>
    `),
    ).join('\n');

    userInfoWrapper.innerHTML = infoTemplate;
  };

  asyncWriteInfo();

  const processWrapper = $.qs('.table-wrapper', container);

  const config = { [processListConfigEnum.SELECT]: false };

  const processList = new ProcessList(processWrapper, config);

  window.api.processList().then(processList.render.bind(processList));

  unmount(onProcessEvent(processList.render.bind(processList)));

  const diskWrapper = $.qs('.home-disk-info', container);

  const asyncWriteDiskInfo = async () => {
    const diskInfo = await window.api.disk();

    const diskTemplate = `
      <h3><span>${diskIcon} Disk:</span> '${diskInfo.dir}'</h3>
      <div class="disk-info-wrapper">
        <p><span>Used:</span> ${diskInfo.used}GiB<p>
        <p><span>Free:</span> ${diskInfo.free}GiB<p>
        <p><span>Total:</span> ${diskInfo.total}GiB<p>
      </div>
    `;

    $.afterBeginInnerHTML(diskWrapper, diskTemplate);
  };

  asyncWriteDiskInfo();
});

export default renderHomePage;
