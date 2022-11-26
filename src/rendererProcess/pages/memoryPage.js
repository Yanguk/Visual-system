/* eslint-disable function-paren-newline */
import StepIntervalHandler from '../util/StepIntervalHandler';
import PieChartGraph from '../common/PieChartGraph';
import PreParsingFn from '../util/PreParsingFn';
import { channelEnum } from '../../lib/constant';
import _ from '../../lib/fp/underDash';
import $ from '../../lib/simpleDom';
import {
  customAddEventListener,
  makeComponent,
  processingMemoryData,
  receiveChannel,
  renderDom,
} from '../util';

const getUsageInfo = processingData => {
  const usageInfo = {
    Compressed: processingData.Compressed,
    App: processingData.App,
    Wired: processingData.Wired,
  };

  return usageInfo;
};

const getPercentageInfo = processingData => {
  const percentageInfo = {
    Usage: processingData.Used,
    Free: processingData.Free,
  };

  return percentageInfo;
};

const receiveDataAndUpdate = (getDataFn, target) => _.pipe(
  getDataFn, target.update.bind(target),
);

const receiveDataAndRender = (getDataFn, target) => _.pipe(
  getDataFn, target.render.bind(target),
);

const getChangeNodeText = nodes => memoryData => {
  const texts = [memoryData.App, memoryData.Wired, memoryData.Free, memoryData.Total];

  nodes.forEach((node, index) => {
    node.textContent = `${texts[index]} GB`;
  });
};

const onMemoryUsageEvent = receiveChannel(channelEnum.MEMORY.DETAIL);

const renderMemoryPage = makeComponent(unmount => {
  const template = `
    <div class="memoryPage" id="memory">
      <div class="memory-page-wrapper item">
        <section>
          <div class="section-Item-Head">
            <h3>Memory Usage Percentage</h3>
          </div>
          <div class="pie-chart-wrapper percentage"></div>
        </section>
        <section>
          <div class="section-Item-Head">
            <h3>Memory Usage Detail</h3>
          </div>
          <div class="pie-chart-wrapper usage"></div>
        </section>
        <section>
          <div class="section-Item-Head">
            <h3>Memory Detail</h3>
          </div>
          <div class="pie-chart-wrapper">
            <table class="column-table memory-table">
              <thead>
                <tr>
                  <th>App: </th>
                  <th>Wired: </th>
                  <th>Free: </th>
                  <th>Total: </th>
                </tr>
                </thead>
              <tbody>
                <tr class="changeText">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `;

  const container = $.el(template);
  unmount(renderDom(container));

  const usagePieChartWrapper = $.qs('.usage', container);
  const percentageChartWrapper = $.qs('.percentage', container);
  const tableTextNodes = $.qsAll('.changeText td', container);

  const percentagePieChart = new PieChartGraph(percentageChartWrapper);
  const usagePieChartGraph = new PieChartGraph(usagePieChartWrapper);
  const preParsingFn = new PreParsingFn(processingMemoryData);
  const twoIntervalHandler = new StepIntervalHandler(2);
  const changeNodeText = getChangeNodeText(tableTextNodes);

  window.api.memoryDetail().then(originData => {
    const usageControllers = [getUsageInfo, usagePieChartGraph];

    const receiveDataAndRenderUsagePie = receiveDataAndRender(
      ...usageControllers,
    );

    const percentageControllers = [getPercentageInfo, percentagePieChart];

    const receiveDataAndRenderPercentagePie = receiveDataAndRender(
      ...percentageControllers,
    );

    preParsingFn.subscribe(receiveDataAndRenderUsagePie);
    preParsingFn.subscribe(receiveDataAndRenderPercentagePie);
    preParsingFn.subscribe(changeNodeText);

    preParsingFn.sendParsingData(originData);
    preParsingFn.removeSubScriber();

    const receiveDataAndUpdateUsagePie = receiveDataAndUpdate(
      ...usageControllers,
    );

    const receiveDataAndUpdatePercentagePie = receiveDataAndUpdate(
      ...percentageControllers,
    );

    preParsingFn.subscribe(receiveDataAndUpdateUsagePie);
    preParsingFn.subscribe(receiveDataAndUpdatePercentagePie);
    preParsingFn.subscribe(changeNodeText);

    twoIntervalHandler.insert(preParsingFn.sendParsingData.bind(preParsingFn));

    unmount(customAddEventListener('resize', () => percentagePieChart.resize()));
    unmount(customAddEventListener('resize', () => usagePieChartGraph.resize()));

    unmount(
      onMemoryUsageEvent(
        twoIntervalHandler.update.bind(twoIntervalHandler)));
  });
});

export default renderMemoryPage;
