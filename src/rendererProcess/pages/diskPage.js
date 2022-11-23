import _ from '../../lib/fp';
import $ from '../../lib/simpleDom';
import DiskBarGraph from '../common/DiskBarGraph';
import { customAddEventListener, makeComponent, renderDom } from '../util';
import { disk } from '../util/icons';

const renderDiskPage = makeComponent(async onMount => {
  const template = `
    <div class="disk-page-container" id="disk">
      <div class="disk-page-wrapper">
        <div class="graph-wrapper">
          <div class="wrapper-item">
            <h3>${disk} Disk Mount '/'</h3>
            <div class="disk-main-graph">
          </div>
        </div>
        </div>
        <div class="diskDetailTable"></div>
      </div>
    </div>
  `;

  const container = $.el(template);
  onMount(renderDom(container));

  const diskMainGraphWrapper = $.qs('.disk-main-graph', container);

  const diskGraph = new DiskBarGraph(diskMainGraphWrapper);

  window.api.disk().then(diskInfo => {
    diskGraph.render(diskInfo);
    onMount(customAddEventListener('resize', () => diskGraph.resize()));
  });

  const diskAllData = await window.api.diskAll();
  const { headList, filteredDiskList } = diskAllData;

  const theadTemplate = _.go(
    headList,
    _.map($.template('th')),
    _.join(),
  );

  const tbodyMainTemplate = _.go(
    filteredDiskList,
    _.map(data => {
      data[6] = `${Number((data[6]) / (1024 ** 3)).toFixed(2)}Gi`;

      return data;
    }),
    _.map(_.pipe(_.map($.template('td')))),
    _.map(_.join()),
    _.map($.template('tr')),
    _.join(),
  );

  const tableTemplate = `
    <table>
      <thead>
        <tr>
          ${theadTemplate}
        </tr>
      </thead>
      <tbody>
        ${tbodyMainTemplate}
      </tbody>
    </table>
  `;

  const diskDetailTable = $.qs('.diskDetailTable', container);
  $.afterBeginInnerHTML(diskDetailTable, tableTemplate);
});

export default renderDiskPage;
