import * as d3 from 'd3';
import { graphEnum } from '../../../lib/constant';

const drawGraphAndGetClear = (data, parentEl, config) => {
  const [width, height] = config[graphEnum.SIZE];
  const [mt, mr, mb, ml] = config[graphEnum.MARGIN];
  const graphColor = config[graphEnum.COLOR];

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
    .domain([0, data.length])
    .range([0, graphWidth]);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([graphHeight, 0]);

  const drawingBarStyle = target => {
    target
      .attr('height', d => graphHeight - y(d))
      .attr('width', graphWidth / data.length - 10)
      .attr('fill', graphColor)
      .attr('x', (d, i) => x(i))
      .attr('y', (d, i) => y(d));
  };

  const bars = graph.selectAll('rect')
    .data(data)
    .enter()
    .append('rect');

  drawingBarStyle(bars);

  const xAxisG = graph
    .append('g')
    .attr('transform', `translate(0, ${graphHeight})`);
  const yAxisG = graph.append('g');

  xAxisG.call(d3.axisBottom(x));
  yAxisG.call(d3.axisLeft(y));

  const updateLine = () => {
    svg
      .selectAll('rect')
      .data(data)
      .join(_ => {}, drawingBarStyle);
  };

  const updateData = () => {
    updateLine();
  };

  const eventFs = [updateData];

  config[graphEnum.ON_LOAD](eventFs);

  return () => {
    config[graphEnum.ON_UNMOUNT](eventFs);
  };
};

export default drawGraphAndGetClear;
