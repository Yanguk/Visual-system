/* eslint-disable newline-per-chained-call */
import * as d3 from 'd3';
import { colorInfo } from '../../lib/constant';
import { delay } from '../../lib/time';

export default class SinglePieGraph {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.svg = null;
    this.isInit = true;
  }

  render(data, total) {
    this.data = data;
    this.total = total;
    const duration = this.isInit ? 1000 : 0;

    if (!this.svg) {
      this.svg = d3
        .select(this.parentEl)
        .append('svg');
    }

    this.svg
      .append('g')
      .attr('class', 'total');

    this.svg
      .append('g')
      .attr('class', 'average');

    this.svg
      .append('g')
      .attr('class', 'text');

    const [width, height] = [this.parentEl.clientWidth, this.parentEl.clientHeight];
    const margin = Math.min(width, height) / 100;
    const radius = Math.min(width, height) / 2 - margin;

    this.svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    this.arc = arc;

    const d3Pie = d3.pie()
      .sort(null);

    this.d3Pie = d3Pie;

    const averagePieData = d3Pie([data, total - data])[0];
    const totalPieData = d3Pie([total])[0];

    const totalG = this.svg
      .select('.total')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const averageG = this.svg
      .select('.average')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const textG = this.svg
      .select('.text')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    totalG
      .selectAll('path')
      .data([totalPieData])
      .join('path')
        .attr('d', arc)
        .attr('fill', colorInfo.text2);

    textG
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em');

    const textDome = textG.select('text')
      .attr('font-size', '2rem')
      .attr('fill', colorInfo.text3);

    const makeArcTween = arcFn => d => {
      const newArc = arcFn;
      const interpolate = d3.interpolate(d.startAngle, d.endAngle);
      const interpolateText = d3.interpolate(0, d.value);

      return time => {
        d.endAngle = interpolate(time);
        textDome.text(`${Math.round(interpolateText(time))}%`);

        return newArc(d);
      };
    };

    const arcTween = this.isInit
      ? makeArcTween(arc)
      : () => {};

    averageG
      .selectAll('path')
      .data([averagePieData])
      .join('path')
        .attr('d', arc)
        .attr('fill', colorInfo.green2)
        .attr('stroke', colorInfo.darkGray)
        .style('stroke-width', '2px')
      .transition(d3.easeCubicOut).duration(duration)
      .attrTween('d', arcTween);

    delay(duration).then(() => {
      this.isInit = false;
    });
  }

  update(data) {
    if (this.isInit) {
      return;
    }

    const averagePieData = this.d3Pie([data, this.total - data])[0];

    this.svg
      .select('.average')
      .selectAll('path')
      .data([averagePieData])
      .join('path')
        .attr('d', this.arc)
        .attr('fill', colorInfo.green2)
        .attr('stroke', colorInfo.darkGray)
        .style('stroke-width', '2px');

    this.svg.selectAll('text')
      .data([data])
      .join('text')
      .text(d => `${Math.round(d)}%`);
  }
}
