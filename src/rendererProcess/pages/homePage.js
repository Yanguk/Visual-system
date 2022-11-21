import _ from '../../lib/fp';
import $ from '../../lib/simpleDom';
import drawGraphAndGetClear from '../common/realTimeGraph';
import { channelEnum, graphEnum, GRAPH_COLOR } from '../../lib/constant';
import {
  insertData, makeComponent, receiveChannel, renderDom,
} from '../util';
import { curry } from '../../lib/fp/util';
import ProcessList, { processListConfigEnum } from '../common/ProcessList';
import { disk as diskIcon } from '../util/icons';

const cpuData = [];
const memoryData = [];

const intervalUpdateCPU = insertData(cpuData);
const intervalUpdateMemory = insertData(memoryData);

const onCPUUsageEvent = receiveChannel(channelEnum.CPU.USAGE);
const onMemoryUsageEvent = receiveChannel(channelEnum.MEMORY.USAGE);
const onProcessEvent = receiveChannel(channelEnum.PROCESS.TOP);

onCPUUsageEvent(intervalUpdateCPU);
onMemoryUsageEvent(intervalUpdateMemory);

const renderHomePage = makeComponent(onMount => {
  const template = `
    <div class="gridContainer homePage" id="home">
      <article class="home_cpu item">
        <p>CPU usage: <span class="cpu_usage text"></span></p>
        <div class="svg_wrapper"></div>
      </article>
      <article class="home_userInfo item">userInfo</article>
      <article class="home_diskInfo item"></article>
      <article class="home_memory item">
        <p>Memory usage: <span class="memory_usage text"></span></p>
        <div class="svg_wrapper"></div>
      </article>
      <article class="home_process item">
        <fieldset class="tableWrapper">
          <legend>Process List</legend>
        </fieldset>
      </article>
    </div>
  `;

  const container = $.el(template);

  onMount(renderDom(container));

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
        <p class='infoWrapper'>
          ${infoEnum[type] === 'name' ? '' : `<span class='title'>${infoEnum[type]}: </span> `}
          <span class='info'>${targetInfo[infoEnum[type]]}</span>
        </p>
    `),
    ).join('\n');

    userInfoWrapper.innerHTML = infoTemplate;
  };

  asyncWriteInfo();

  const processWrapper = $.qs('.tableWrapper', container);

  const config = { [processListConfigEnum.SELECT]: false };

  const processList = new ProcessList(processWrapper, config);

  const getDataAndRenderProcess = async () => {
    const data = await window.api.processList(21);
    processList.render(data);
  };

  getDataAndRenderProcess();

  const getDataAndUpdateProcess = processInfo => {
    const sliceData = processInfo.slice(0, 21);
    processList.render(sliceData);
  };

  onMount(onProcessEvent(getDataAndUpdateProcess));

  const diskWrapper = $.qs('.home_diskInfo', container);

  const asyncWriteDiskInfo = async () => {
    const diskInfo = await window.api.disk();

    const diskTemplate = `
      <h3><span>${diskIcon} Disk:</span> '${diskInfo.dir}'</h3>
      <div class="diskInfoWrapper">
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
