import * as d3 from 'd3';
import { graphEnum } from '../../lib/constant';
import { makeComponent } from '../util';

const drawGraphAndGetClear = makeComponent((onMount, data, parentEl, config) => {
  const [width, height] = [parentEl.clientWidth, parentEl.clientHeight];
  const [mt, mr, mb, ml] = config[graphEnum.MARGIN];
  const onInterval = config[graphEnum.INTERVAL];
  const graphColor = config[graphEnum.COLOR];

  const graphWidth = width - ml - mr;
  const graphHeight = height - mt - mb;

  const svg = d3
    .select(parentEl)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

  const graph = svg
    .append('g')
    .attr('class', 'graph')
    .attr('transform', `translate(${ml}, ${mt})`);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([graphHeight, 0]);

  // const scale = d3.scaleTime();

  // x축 흘러가는 시간 맞춰야함  x축을 기준으로 삼을수잇게 scaleTime 알아볼것
  // const getTimeDomain = () => {
  //   const t = Date.now();
  //   const domain = [t - (1 * 1 * 55 * 1000) / 5, t + (1 * 1 * 55 * 1000) / 5];
  //   return domain;
  // };

  const x = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, graphWidth]);

  const timeX = d3.scaleTime()
    .domain([0, data.length])
    .range([0, graphWidth]);

  // toDo: 추후 라인그래프로 수정
  // toDo: 추후 애니메이션 추가
  const path = graph.selectAll('path')
    .data(data)
    .enter()
    .append('path');

  const xfn = (d, i) => x(i);
  const yfn = (d, i) => y(d);

  const fnArea = d3.area()
    .x(xfn)
    .y0((d, i) => y(0))
    .y1(yfn);
    // .curve(d3.curveMonotoneX);

  const xAxisG = graph
    .append('g')
    .attr('transform', `translate(0, ${graphHeight})`);

  const yAxisG = graph.append('g');

  xAxisG.transition()
    .duration(500)
    .ease(d3.easeLinear);

  xAxisG.call(d3.axisBottom(timeX));
  yAxisG.call(d3.axisLeft(y));

  const drawingBar = target => {
    target
      .attr('height', d => graphHeight - y(d))
      .attr('width', graphWidth / data.length / 3)
      .attr('fill', graphColor)
      .attr('x', xfn)
      .attr('y', yfn)
      .attr('d', fnArea(data));

    // .transition()
    // .duration(500)
    // .ease(d3.easeLinear);
    // .attr('transform', `translate(${x(-1)}, 0)`);

    // timeX.domain(getTimeDomain());
    // xAxisG.call(d3.axisBottom(timeX));
  };

  drawingBar(path);

  const updateData = () => {
    // svg
    //   .selectAll('path')
    //   .data(data)
    //   .join(_ => {}, drawingBar);

    drawingBar(path);

    // timeX.domain(getTimeDomain());
    // xAxisG.call(d3.axisBottom(timeX));
  };

  // toDo: 추후 반응형 고려 이벤트 추가
  const resizeEventHandler = () => {
    const resizeEvent = () => {
      const [resizeWidth, resizeHeight] = [
        parentEl.clientWidth,
        parentEl.clientHeight,
      ];

      svg
        .attr('width', resizeWidth)
        .attr('height', resizeHeight)
        .attr('viewBox', `0 0 ${width} ${height}`);

      updateData();
    };

    window.addEventListener('resize', resizeEvent);
    return () => window.removeEventListener('resize', resizeEvent);
  };

  onMount(resizeEventHandler());
  onMount(onInterval(updateData));
});

export default drawGraphAndGetClear;
