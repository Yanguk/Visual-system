import { channelEnum, graphEnum, GRAPH_COLOR } from '../../../lib/constant';
import _ from '../../../lib/fp';
import L from '../../../lib/fp/lazy';
import { curry, push } from '../../../lib/fp/util';
import $ from '../../../lib/simpleDom';
import drawGraphAndGetClear from '../../common/realTimeGraph';
import { insertData, makeComponent, receiveChannel } from '../../util';
import './index.scss';

const root = $.qs('#root');

const cpuInfo = [];

const cpuAllUsageCoreInfo = [];

const onAllUsageCPUEvent = receiveChannel(channelEnum.CPU.ALL_USAGE);

window.api.cpu().then(data => {
  _.each(push(cpuInfo), data);

  const insertDataFns = _.go(
    _.range(cpuInfo.length),
    _.tap(_.each(_ => cpuAllUsageCoreInfo.push([]))),
    _.map(index => insertData(cpuAllUsageCoreInfo[index])),
  );

  onAllUsageCPUEvent(cpuData => {
    _.go(
      _.range(cpuData.length),
      _.map(index => [cpuData[index], index]),
      _.each(([usage, index]) => insertDataFns[index](usage)),
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
        <p>CPU CORE ${index + 1} 사용량 <span class="cpu_text"></span></p>
        <div class="cpu_core item"></div>
      </div>
    `),
    _.join('\n'),
  );

  container.innerHTML = coreTemplate;
  $.append(root, container);

  const changeUsageText = curry((el, data) => {
    el.textContent = `${data}%`;
  });

  onMount(onAllUsageCPUEvent(data => {
    _.go(
      _.range(data.length),
      _.each(index => {
        _.go(
          [...$.findAll('.cpu_text', container)],
          _.each(dom => changeUsageText(dom, data[index])),
        );
      }),
    );
  }));

  onMount(() => container.remove());

  const graphConfig = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.INTERVAL]: onAllUsageCPUEvent,
  };

  _.go(
    [...$.findAll('.cpu_core', container)],
    _.getIndex,
    _.each(([dom, idx]) => {
      onMount(drawGraphAndGetClear(cpuAllUsageCoreInfo[idx], dom, graphConfig));
    }),
  );
});

export default renderCPUPage;
