/* eslint-disable newline-per-chained-call */
import * as d3 from 'd3';
import { colorInfo } from '../../lib/constant';

const colorArr = [colorInfo.green, colorInfo.text1];

class DiskBarGraph {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.svg = null;
    this.data = [];
  }

  render(data) {
    this.data = data;
    const [width, height] = [this.parentEl.clientWidth, this.parentEl.clientHeight];
    const margin = 20;
    const iterData = Object.entries(data);
    const [_, total, ...validData] = iterData;
    const [graphWidth, graphHeight] = [width - margin * 2, height - margin * 2];
    const duration = 0;

    if (!this.svg) {
      this.svg = d3.select(this.parentEl)
        .append('svg');
    }

    this.svg
      .attr('width', width)
      .attr('height', height);

    const fx = d3.scaleLinear()
      .domain([0, total[1]])
      .range([0, graphWidth]);

    let cumulative = 0;

    const barHeight = 120;

    const graph = this.svg
      .append('g')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr('transform', `translate(${margin}, ${margin})`);

    graph
      .selectAll('rect')
      .data(validData)
      .join('rect')
      .attr('class', d => d[0])
      .attr('height', barHeight)
      .attr('width', d => fx(d[1]))
      .attr('y', graphHeight / 2 - barHeight / 2)
    .transition().duration(duration).ease(d3.easeQuadOut)
      .attr('x', (d, i) => {
        const dx = fx(cumulative);

        cumulative += d[1];
        return dx;
      })
      .attr('fill', (d, i) => colorArr[i]);

    let textCumulative = 0;

    graph
      .selectAll('.text-value-middle')
      .data(validData)
      .join('text')
      .attr('class', 'text-value-middle')
      .attr('text-anchor', 'middle')
      .text(d => `${d[0]} ${Math.round((d[1] / total[1]) * 100)}%`)
      .attr('y', graphHeight / 2 + 5)
    .transition().duration(duration).ease(d3.easeQuadOut)
      .attr('x', d => {
        const cumulativeX = fx(textCumulative) + (fx(d[1]) / 2);
        textCumulative += d[1];
        return cumulativeX;
      });

    let valueCumulative = 0;

    graph
      .selectAll('.text-value')
      .data(validData)
      .join('text')
      .attr('class', 'text-value')
      .attr('text-anchor', 'middle')
      .attr('y', graphHeight / 2 + (barHeight / 2) * 1.1 + 20)
    .transition().duration(duration).ease(d3.easeQuadOut)
      .text(d => `${d[1]}GB`)
      .attr('x', d => {
        const cumulativeX = fx(valueCumulative) + (fx(d[1]) / 2);
        valueCumulative += d[1];
        return cumulativeX;
      })
      .attr('fill', (d, i) => colorArr[i]);

    graph
      .selectAll('.total-text')
      .data([total])
      .join('text')
      .attr('class', 'total-text')
      .attr('text-anchor', 'middle')
      .text(d => `${d[0].toUpperCase()} ${d[1]}GB`)
      .attr('x', 55)
      .attr('y', 5)
      .attr('fill', colorInfo.text3);
  }

  resize() {
    this.svg.selectAll('*')
      .remove();

    this.render(this.data);
  }
}

export default DiskBarGraph;
