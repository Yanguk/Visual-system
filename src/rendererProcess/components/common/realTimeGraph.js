import * as d3 from 'd3';
import { graphEnum } from '../../../lib/constant';
import _ from '../../../lib/fp';

const drawGraphAndGetClear = (data, parentEl, config) => {
  const [width, height] = [parentEl.offsetWidth, parentEl.offsetHeight];
  const [mt, mr, mb, ml] = config[graphEnum.MARGIN];
  const graphColor = config[graphEnum.COLOR];
  const onInterval = config[graphEnum.INTERVAL];

  const graphWidth = width - ml - mr;
  const graphHeight = height - mt - mb;

  const svg = d3
    .select(parentEl)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`);

  const graph = svg
    .append('g')
    .attr('class', 'graph')
    .attr('transform', `translate(${ml}, ${mt})`);

  const x = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, graphWidth]);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([graphHeight, 0]);

  // toDo: 추후 라인그래프로 수정
  const bars = graph.selectAll('rect')
    .data(data)
    .enter()
    .append('rect');

  const drawingBarStyle = target => {
    target
      .attr('height', d => graphHeight - y(d))
      .attr('width', (graphWidth / data.length) / 3)
      .attr('fill', graphColor)
      .attr('x', (d, i) => x(i) - (graphWidth / data.length) / 6)
      .attr('y', (d, i) => y(d));
  };

  drawingBarStyle(bars);

  const xAxisG = graph
    .append('g')
    .attr('transform', `translate(0, ${graphHeight})`);

  const yAxisG = graph.append('g');

  xAxisG.call(d3.axisBottom(x));
  yAxisG.call(d3.axisLeft(y));

  const updateData = () => {
    svg
      .selectAll('rect')
      .data(data)
      .join(_ => {}, drawingBarStyle);
  };

  // toDo: 추후 반응형 고려 이벤트 추가
  const resizeEventHandler = {
    wrapper: parentEl,
    onEvent: () => {},
    on() {
      const resizeEvent = () => {
        const [resizeWidth, resizeHeight] = [
          parentEl.offsetWidth,
          parentEl.offsetHeight,
        ];

        svg.attr('width', resizeWidth).attr('height', resizeHeight);
      };

      this.onEvent = resizeEvent;
      window.addEventListener('resize', this.onEvent);
    },
    clear() {
      window.removeEventListener('resize', this.onEvent);
    },
  };

  const eventFs = [updateData];

  resizeEventHandler.on();

  const clearFns = onInterval(eventFs);
  const clearInterval = _.each(f => f());

  return () => {
    resizeEventHandler.clear();
    clearInterval(clearFns);
  };
};

export default drawGraphAndGetClear;
