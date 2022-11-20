import {
  customAddEventListener, customSetInterval, makeComponent, renderDom,
} from '../util';
import $ from '../../lib/simpleDom';
import Toast from '../common/Toast';
import { colorInfo, graphEnum, GRAPH_COLOR } from '../../lib/constant';
import _ from '../../lib/fp';
import TreeMapChart from '../common/TreeMapChart';
import ProcessList, { processListConfigEnum } from '../common/ProcessList';

const processingProcessData = (data, selectIndex) => _.go(
  data,
  ([_title, ...rest]) => rest,
  _.map(info => ({ name: info[0], value: info[selectIndex] })),
);

const renderProcessPage = makeComponent(onMount => {
  const template = `
    <div class="processPageContainer" id="process">
      <section class="leftProcess">
        <div class="leftTitle">
          <p>CPU usage %</p>
        </div>
        <div class="processTreeMap"></div>
      </section>
      <section class="rightProcess">
        <div class="rightTitle">
          <p>Process List</p>
          <button class="killButton">kill Process</button>
        </div>
        <div class="processListWrapper">
          <fieldset class="tableWrapper"></fieldset>
        </div>
      </section>
    </div>
  `;

  const container = $.el(template);
  onMount(renderDom(container));

  const processListWrapper = $.qs('.tableWrapper', container);
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
        selectProcess.classList.add('cancelText');
      } else {
        toastElement.render('Deny permission', colorInfo.red);
      }
    }
  });

  const processTreeChartWrapper = $.qs('.processTreeMap', container);

  const config = {
    [graphEnum.MARGIN]: [20, 25, 20, 25],
    [graphEnum.COLOR]: GRAPH_COLOR,
    [graphEnum.FONT_SIZE]: 12,
  };

  const treeMapChart = new TreeMapChart(processTreeChartWrapper, config);

  const makeTreeData = (info, name) => (
    { name, children: processingProcessData(info, 2) }
  );

  const updateProcessData = async () => {
    const data = await window.api.processList(100);
    treeMapChart.render(makeTreeData(data.slice(0, 21), 'cpu'));
    processList.render(data);
  };

  updateProcessData();

  onMount(customSetInterval(3000, updateProcessData));
  onMount(customAddEventListener('resize', () => treeMapChart.resize()));
});

export default renderProcessPage;
