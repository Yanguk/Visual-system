import * as d3 from 'd3';

import { customAddEventListener, getTimeDomain, makeComponent } from '../util';
import { graphEnum } from '../../lib/constant';

const resizeEvent = customAddEventListener('resize');

const drawGraphAndGetClear = makeComponent((unmount, data, parentEl, config) => {
  const [mt, mr, mb, ml] = config[graphEnum.MARGIN];
  const onInterval = config[graphEnum.INTERVAL];
  const graphColor = config[graphEnum.COLOR];

  const svg = d3
    .select(parentEl)
    .append('svg');

  const graphController = {
    newDrawing: () => {},
    updateDraw: () => {},
    clearGraph: () => {},
  };

  graphController.newDrawing = () => {
    const [width, height] = [parentEl.clientWidth, parentEl.clientHeight];
    const graphWidth = width - ml - mr;
    const graphHeight = height - mt - mb;

    const graph = svg
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('class', 'graph')
        .attr('transform', `translate(${ml}, ${mt})`);

    const xScale = d3.scaleTime()
      .domain(getTimeDomain())
      .range([0, graphWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([graphHeight, 0]);

    const xAisG = graph
        .append('g')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(d3.axisBottom(xScale).ticks(10).tickSizeOuter(0));

    graph
      .append('g')
      .call(d3.axisLeft(yScale).ticks(5));

    const fx = (d, i) => xScale(d.date);
    const fy = (d, i) => yScale(d.data);

    const areaFn = d3.area()
      .x(fx)
      .y0((d, i) => yScale(0))
      .y1(fy);

    const lineFn = d3.line()
      .x(fx)
      .y(fy);

    const path = graph
      .append('g')
        .attr('class', 'fillPath')
      .append('path')
        .attr('fill', graphColor)
        .attr('fill-opacity', 0.3)
        .attr('stroke', 'none')
        .attr('d', areaFn(data));

    const strokePath = graph
      .append('g')
        .attr('class', 'strokePath')
      .append('path')
        .attr('fill', 'none')
        .attr('stroke', graphColor)
        .attr('stroke-width', 1)
        .attr('d', lineFn(data));

    graphController.updateDraw = () => {
      xScale.domain(getTimeDomain());
      xAisG.call(d3.axisBottom(xScale).ticks(10).tickSizeOuter(0));

      path
        .join('path')
        .attr('d', areaFn(data));

      strokePath
        .join('path')
        .attr('d', lineFn(data));
    };

    graphController.clearGraph = onInterval(() => graphController.updateDraw());
  };

  graphController.newDrawing();

  const reSizing = () => {
    svg.selectAll('*').remove();
    graphController.clearGraph();
    graphController.newDrawing();
  };

  unmount(() => graphController.clearGraph());

  unmount(resizeEvent(reSizing));
});

export default drawGraphAndGetClear;
