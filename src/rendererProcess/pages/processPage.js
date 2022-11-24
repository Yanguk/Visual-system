import ProcessList, { processListConfigEnum } from '../common/ProcessList';
import TreeMapChart from '../common/TreeMapChart';
import $ from '../../lib/simpleDom';
import Toast from '../common/Toast';
import _ from '../../lib/fp';
import {
  channelEnum, colorInfo, graphEnum, GRAPH_COLOR,
} from '../../lib/constant';
import {
  customAddEventListener, makeComponent, receiveChannel, renderDom,
} from '../util';

const onProcessEvent = receiveChannel(channelEnum.PROCESS.List);

const processingProcessData = (data, selectIndex) => _.go(
  data,
  ([_title, ...rest]) => rest,
  _.map(info => ({ name: info[0], value: info[selectIndex], pid: info[1] })),
);

const renderProcessPage = makeComponent(onMount => {
  const template = `
    <div class="process-page-container" id="process">
      <section class="left-process">
        <div class="left-title">
          <p>CPU usage %</p>
        </div>
        <div class="process-tree-map"></div>
      </section>
      <section class="right-process">
        <div class="right-title">
          <p>Process List</p>
          <button class="killButton">kill Process</button>
        </div>
        <div class="process-list-wrapper">
          <fieldset class="table-wrapper"></fieldset>
        </div>
      </section>
    </div>
  `;

  const container = $.el(template);
  onMount(renderDom(container));

  const processListWrapper = $.qs('.table-wrapper', container);
  const processConfig = {
    [processListConfigEnum.SELECT]: true,
  };

  const processList = new ProcessList(processListWrapper, processConfig);

  const processKillButton = $.qs('.killButton', container);

  const toastElement = new Toast();

  processKillButton.addEventListener('click', async () => {
    const selectProcess = $.qs('.selected', processListWrapper);

    if (selectProcess?.dataset) {
      const targetPid = selectProcess?.dataset.id;
      const result = await window.api.processKill(targetPid);

      if (result.ok) {
        toastElement.render('Kill process', colorInfo.green2);
        selectProcess.classList.add('cancel-text');
      } else {
        toastElement.render('Deny permission', colorInfo.red);
      }
    }
  });

  const processTreeChartWrapper = $.qs('.process-tree-map', container);

  const config = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.FONT_SIZE]: 12,
  };

  const treeMapChart = new TreeMapChart(processTreeChartWrapper, config);

  const makeTreeData = (info, name) => (
    { name, children: processingProcessData(info, 2) }
  );

  const updateProcessData = data => {
    treeMapChart.render(makeTreeData(data.slice(0, 21), 'cpu'));
    processList.render(data);
  };

  window.api.processList().then(updateProcessData);

  onMount(onProcessEvent(updateProcessData));
  onMount(customAddEventListener('resize', () => treeMapChart.resize()));
});

export default renderProcessPage;
