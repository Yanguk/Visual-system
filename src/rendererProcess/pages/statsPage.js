import $ from '../../lib/simpleDom';
import SinglePieGraph from '../common/SinglePieGraph';
import {
  customSetInterval, makeComponent, makeTimeFormat, renderDom,
} from '../util';

const renderStatsPage = makeComponent(onMount => {
  const template = `
    <div class="statsPageContainer" id="stats">
      <div class="statsPageWrapper item">
        <h1>Time Line <span class="time">00:00:00</span></h1>
        <div class="graphContainer">
          <div class="graphWrapper">
            <h2>Average CPU Usage</h2>
            <div class="cpu_graph">
            </div>
          </div>
          <div class="graphWrapper">
            <h2>Average Memory Usage</h2>
            <div class="memory_graph">
            </div>
          </div>
        </div>
      </div>
        <button class="test">Test</button>
    </div>
  `;

  const container = $.el(template);
  onMount(renderDom(container));

  const cpuGraphWrapper = $.qs('.cpu_graph', container);
  const memoryGraphWrapper = $.qs('.memory_graph', container);

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

  onMount(customSetInterval(1000, updateGraph));
});

export default renderStatsPage;
