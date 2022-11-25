import { channelEnum, graphEnum, GRAPH_COLOR } from '../../lib/constant';
import drawGraphAndGetClear from '../common/realTimeGraph';
import { push } from '../../lib/fp/util';
import _ from '../../lib/fp/underDash';
import $ from '../../lib/simpleDom';
import L from '../../lib/fp/lazy';
import {
  insertRealTimeGraphData, makeComponent, receiveChannel, renderDom,
} from '../util';

const cpuInfo = [];

const cpuAllUsageCoreInfo = [];

const onAllUsageCPUEvent = receiveChannel(channelEnum.CPU.ALL_USAGE);

const init = window.api.cpu().then(data => {
  _.each(push(cpuInfo), data);

  const insertDataFns = _.go(
    _.range(cpuInfo.length),
    _.tap(_.each(_ => cpuAllUsageCoreInfo.push([]))),
    _.map(index => insertRealTimeGraphData(cpuAllUsageCoreInfo[index])),
  );

  onAllUsageCPUEvent(_.pipe(L.bind(insertDataFns), _.each(([usage, fn]) => fn(usage))));
});

const renderCPUPage = makeComponent(async onMount => {
  const container = _.go(
    $.template('article', ''),
    $.el,
    $.addClass('flex-container'),
    $.addClass('cpuPage'),
  );

  container.id = 'cpu';

  await init;

  onMount(renderDom(container));

  const coreTemplate = _.go(
    L.range(cpuInfo.length),
    _.map(index => `
      <div class="cpu-core-wrapper">
        <p>CPU CORE ${index + 1} usage <span class="cpu_text"></span></p>
        <div class="cpu_core item"></div>
      </div>
    `),
    _.join('\n'),
  );

  $.afterBeginInnerHTML(container, coreTemplate);

  const changeUsageText = ([data, el]) => {
    el.textContent = `${Math.round(data)}%`;
  };

  const textEl = [...$.findAll('.cpu_text', container)];

  onMount(onAllUsageCPUEvent(_.pipe(L.bind(textEl), _.each(changeUsageText))));

  const graphConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.INTERVAL]: onAllUsageCPUEvent,
  };

  _.go(
    [...$.findAll('.cpu_core', container)],
    L.bind(cpuAllUsageCoreInfo),
    _.each(([dom, cpuItem]) => onMount(drawGraphAndGetClear(cpuItem, dom, graphConfig))),
  );
});

export default renderCPUPage;
