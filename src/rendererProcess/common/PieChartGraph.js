/* eslint-disable newline-per-chained-call */
import * as d3 from 'd3';
import { colorInfo } from '../../lib/constant';
import { add } from '../../lib/fp/util';
import { delay } from '../../lib/time';
import _ from '../../lib/fp';

const makeArcTween = arcFn => d => {
  const arc = arcFn;
  const interpolate = d3.interpolate(d.startAngle, d.endAngle);

  return time => {
    d.endAngle = interpolate(time);
    return arc(d);
  };
};

export default class PieChartGraph {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.svg = null;
    this.chart = null;
    this.color = null;
    this.pie = null;
    this.data = [];
    this.arc = null;
    this.outerArc = null;
    this.duration = 1000;
    this.isInit = true;
    this.sum = 0;
  }

  render(data) {
    this.data = data;

    const duration = this.isInit
      ? this.duration
      : 0;

    const [width, height] = [this.parentEl.clientWidth, this.parentEl.clientHeight];
    const margin = Math.min(width, height) / 10;
    const radius = Math.min(width, height) / 2 - margin;
    const rebelGap = 20;
    const fontSize = '0.8rem';

    if (this.isInit) {
      this.svg = d3.select(this.parentEl)
        .append('svg');
    }

    this.chart = this.svg.append('g');

    this.svg
      .attr('width', width)
      .attr('height', height);

    this.chart
      .attr('transform', `translate(${width / 2}, ${height / 2 - height / 10})`);

    if (this.isInit) {
      this.color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(d3.schemeDark2);
    }

    this.pie = d3.pie()
      .sort(null)
      .value(d => d[1]);

    const pieData = this.pie(Object.entries(data));

    const arc = d3.arc()
      .innerRadius(radius * 0.3)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    this.arc = arc;
    this.outerArc = outerArc;

    const arcTween = this.isInit
      ? makeArcTween(arc)
      : () => {};

    this.chart
      .selectAll('path')
      .data(pieData)
      .join('path')
        .attr('fill', d => this.color(d.data[0]))
        .style('opacity', 0.9)
        .attr('d', arc)
        .attr('stroke', colorInfo.darkGray)
        .style('stroke-width', '2px')
      .transition().duration(duration).attrTween('d', arcTween);

    if (this.isInit) {
      delay(duration).then(() => {
        this.isInit = false;
      });
    }

    this.chart
      .selectAll('polyline')
      .data(pieData)
      .join('polyline')
        .attr('stroke', colorInfo.text3)
      .transition().duration(duration)
        .style('fill', 'none')
        .attr('stroke-width', 1)
        .attr('points', d => {
          const posA = arc.centroid(d);
          const posB = outerArc.centroid(d);
          const posC = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          posC[0] = radius * 0.78 * (midAngle < Math.PI ? 1 : -1);

          return [posA, posB, posC];
        });

    this.chart
      .append('g')
      .attr('class', 'chartText')
      .selectAll('text')
      .data(pieData)
      .join('text')
        .text(d => d.data[0])
      .transition().duration(duration)
        .attr('fill', colorInfo.text3)
        .attr('font-size', fontSize)
        .attr('transform', d => {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.8 * (midAngle < Math.PI ? 1 : -1);
          pos[1] += 3;

          return `translate(${pos})`;
        })
        .style('text-anchor', d => {
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midAngle < Math.PI ? 'start' : 'end';
        });

    const legendG = this.chart
      .selectAll('.legend')
      .data(pieData)
      .join('g')
        .attr('transform', (d, i) => `translate(${-radius + margin}, ${radius + i * rebelGap})`)
        .attr('class', 'legend');

    legendG
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', d => this.color(d.data[0]));

    const sum = _.go(
      pieData,
      _.map(d => d.data[1]),
      _.reduce(add),
    );

    this.sum = sum;

    legendG.append('text')
      .text(d => `${d.data[0]} ${Math.round((d.data[1] / sum) * 100)} %`)
      .attr('fill', colorInfo.text3)
      .style('font-size', fontSize)
      .attr('y', 10)
      .attr('x', 15);
  }

  update(data) {
    const pieData = this.pie(Object.entries(data));

    this.chart
      .selectAll('.legend text')
      .join('text')
      .attr('d', pieData)
      .text(d => `${d.data[0]} ${Math.round((d.data[1] / this.sum) * 100)} %`);

    if (this.isInit) {
      return;
    }

    this.chart
      .selectAll('path')
      .data(pieData)
      .join('path')
    .transition().duration(this.duration)
      .attr('d', this.arc)
      .attr('points', d => {
        const posA = this.arc.centroid(d);
        const posB = this.outerArc.centroid(d);
        const posC = this.outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = this.radius * 0.8 * (midAngle < Math.PI ? 1 : -1);

        return [posA, posB, posC];
      });

    this.chart
      .selectAll('polyline')
      .data(pieData)
      .join('polyline')
    .transition().duration(this.duration);

    this.chart
      .select('.chartText')
      .selectAll('text')
      .data(pieData)
      .join('text')
      .text(d => d.data[0]);
  }

  resize() {
    this
      .svg
      .selectAll('*')
      .remove();

    this.render(this.data);
  }
}
