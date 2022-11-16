import {
  channelEnum, DOMAIN_TIME_DIFF, graphEnum, GRAPH_COLOR,
} from '../../../lib/constant';
import _ from '../../../lib/fp';
import L from '../../../lib/fp/lazy';
import { curry } from '../../../lib/fp/util';
import $ from '../../../lib/simpleDom';
import drawGraphAndGetClear from '../../common/realTimeGraph';
import { makeComponent, receiveChannel } from '../../util';
import './index.scss';

const root = $.qs('#root');

let cpuInfo = [];

const cpuAllUsageCoreInfo = [];

const onAllUsageCPUEvent = receiveChannel(channelEnum.CPU.ALL_USAGE);

let isMaxLength = false;

window.api.cpu().then(data => {
  cpuInfo = data;

  _.go(
    L.range(cpuInfo.length),
    _.map(_ => cpuAllUsageCoreInfo.push([])),
  );

  onAllUsageCPUEvent(cpuData => {
    const today = new Date();

    if (isMaxLength) {
      cpuData.forEach((_, i) => {
        const info = { data: cpuData[i], date: today };
        cpuAllUsageCoreInfo[i].push(info);
        cpuAllUsageCoreInfo[i].shift();
      });
    }

    if (
      cpuAllUsageCoreInfo[0][0]?.date
      && cpuAllUsageCoreInfo[0][0].date < new Date(today - DOMAIN_TIME_DIFF)
    ) {
      isMaxLength = true;
    } else {
      cpuData.forEach((_, i) => {
        const info = { data: cpuData[i], date: today };
        cpuAllUsageCoreInfo[i].push(info);
      });
    }
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

  let idx = 0;

  _.go(
    [...$.findAll('.cpu_core', container)],
    _.each(dom => {
      onMount(drawGraphAndGetClear(cpuAllUsageCoreInfo[idx++], dom, graphConfig));
    }),
  );
});

export default renderCPUPage;
