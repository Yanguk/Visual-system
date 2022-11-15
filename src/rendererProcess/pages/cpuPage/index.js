import {
  channelEnum, DATA_LENGTH, graphEnum, GRAPH_COLOR,
} from '../../../lib/constant';
import _, { pushAndShift } from '../../../lib/fp';
import L from '../../../lib/fp/lazy';
import $ from '../../../lib/simpleDom';
import drawGraphAndGetClear from '../../common/realTimeGraph';
import { makeComponent, receiveChannel } from '../../util';
import './index.scss';

const root = $.qs('#root');

let cpuInfo = [];

let cpuAllUsageCoreInfo = [];

const onAllUsageCPUEvent = receiveChannel(channelEnum.CPU.ALL_USAGE);

window.api.cpu().then(data => {
  cpuInfo = data;

  cpuAllUsageCoreInfo = _.go(
    L.range(cpuInfo.length),
    _.map(() => Array.from({ length: DATA_LENGTH }, _ => 0)),
  );

  onAllUsageCPUEvent(cpuData => {
    _.go(
      _.range(cpuData.length),
      _.each(index => pushAndShift(cpuAllUsageCoreInfo[index], cpuData[index])),
    );
  });
});

const renderCPUPage = makeComponent(onMount => {
  const container = _.go(
    $.template('article'),
    $.el,
    $.addClass('flexContainer'),
    $.addClass('cpuPage'),
  );

  const coreTemplate = _.go(
    L.range(cpuInfo.length),
    _.map(index => `
      <div class="cpu_core_wrapper">
        <p>CPU CORE ${index + 1} 사용량 %</p>
        <div class="cpu_core item"></div>
      </div>
    `),
    _.join('\n'),
  );

  container.innerHTML = coreTemplate;

  onMount(() => container.remove());

  $.append(root, container);

  const graphConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.INTERVAL]: onAllUsageCPUEvent,
  };

  let idx = 0;

  _.go(
    [...$.findAll('.cpu_core', container)],
    _.each(dom => {
      onMount(drawGraphAndGetClear(cpuAllUsageCoreInfo[idx++], dom, graphConfig));
    }),
  );
});

export default renderCPUPage;
