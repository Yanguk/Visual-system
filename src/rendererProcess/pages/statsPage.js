import SinglePieGraph from '../common/SinglePieGraph';
import $ from '../../lib/simpleDom';
import {
  customSetInterval, makeComponent, makeTimeFormat, renderDom,
} from '../util';

const renderStatsPage = makeComponent(unmount => {
  const template = `
    <div class="stats-page-container" id="stats">
      <div class="stats-page-wrapper item">
        <h1>Time Line <span class="time">00:00:00</span></h1>
        <div class="graph-container">
          <div class="graph-wrapper">
            <h2>Average CPU Usage</h2>
            <div class="cpu-graph">
            </div>
          </div>
          <div class="graph-wrapper">
            <h2>Average Memory Usage</h2>
            <div class="memory-graph">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const container = $.el(template);
  unmount(renderDom(container));

  const cpuGraphWrapper = $.qs('.cpu-graph', container);
  const memoryGraphWrapper = $.qs('.memory-graph', container);

  const cpuPieGraph = new SinglePieGraph(cpuGraphWrapper);
  const memoryGraph = new SinglePieGraph(memoryGraphWrapper);
  const timeTextDom = $.qs('.time', container);

  const renderGraph = data => {
    const total = 100;
    cpuPieGraph.render(data.cpu.average, total);
    memoryGraph.render(data.memory.average, total);

    const msTime = data.cpu.time;
    timeTextDom.textContent = makeTimeFormat(msTime);
  };

  window.api.getStats().then(renderGraph);

  const updateGraph = async () => {
    const data = await window.api.getStats();

    cpuPieGraph.update(data.cpu.average);
    memoryGraph.update(data.memory.average);

    const msTime = data.cpu.time;
    timeTextDom.textContent = makeTimeFormat(msTime);
  };

  unmount(customSetInterval(1000, updateGraph));
});

export default renderStatsPage;
