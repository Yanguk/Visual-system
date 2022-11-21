/* eslint-disable newline-per-chained-call */
/* eslint-disable no-nested-ternary */
import * as d3 from 'd3';
import { graphEnum, colorInfo } from '../../lib/constant';

const getColorScale = chartColor => {
  const fader = color => d3.interpolateRgb(color, chartColor)(0.2);
  const colorScale = d3.scaleOrdinal(d3.schemePaired.map(fader));
  return colorScale;
};

export default class TreeMapChart {
  constructor(parentEl, config) {
    this.parentEl = parentEl;
    this.config = config;
    this.svg = null;
    this.colorScale = getColorScale(colorInfo.darkGray);
    this.isInit = true;
    this.data = [];
    this.duration = 800;
  }

  render(data) {
    const duration = this.duration;
    const durationInit = (this.isInit && this.svg) ? 0 : duration;

    if (!this.svg) {
      this.svg = d3.select(this.parentEl).append('svg');
    }

    this.data = data;

    const [width, height] = [this.parentEl.clientWidth, this.parentEl.clientHeight];
    const fontSize = this.config[graphEnum.FONT_SIZE];

    this.svg
      .attr('width', width)
      .attr('height', height);

    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    const treeMapRoot = d3.treemap()
      .size([width, height])
      .padding(5);

    const leaves = treeMapRoot(root).leaves();

    this.svg
      .selectAll('g')
      .data(leaves, d => d.data.name)
      .join(
        enter => {
          const g = enter
            .append('g')
            .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

          g.append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('fill', (d, i) => (
              i < 2
                ? this.colorScale(2)
                : d.value > 2
                  ? this.colorScale(1)
                  : this.colorScale(3)
            ))
            .style('opacity', 1e-6)
          .transition().duration(durationInit)
            .style('opacity', 1);

          g.append('text')
            .text(d => `${d.data.name} ${d.data.value}`)
            .attr('data-width', d => d.x1 - d.x0)
            .attr('font-size', `${fontSize}px`)
            .attr('x', 3)
            .attr('y', fontSize)
            .call(this.wrapText.bind(this))
            .style('opacity', 1e-6)
          .transition().duration(durationInit)
            .style('opacity', 1);
        },
        update => {
          update
            .transition().duration(duration)
              .attr('transform', d => `translate(${d.x0},${d.y0})`)
            .select('rect')
              .attr('width', d => d.x1 - d.x0)
              .attr('height', d => d.y1 - d.y0)
              .attr('fill', (d, i) => (
                i < 2
                  ? this.colorScale(2)
                  : d.value > 2
                    ? this.colorScale(1)
                    : this.colorScale(3)
              ))
              .style('opacity', 1);

          update
            .select('text')
            .attr('data-width', d => d.x1 - d.x0);
        },
        exit => exit
            .style('opacity', 1)
          .transition().duration(duration)
            .style('opacity', 1e-6)
            .remove(),
      );

    this.isInit = false;
  }

  wrapText(selection) {
    const fontSize = this.config[graphEnum.FONT_SIZE];

    selection.each(function addText() {
      const node = d3.select(this);
      const words = node.text().split(' ').reverse();

      const rectWidth = +node.attr('data-width');
      const x = node.attr('x');
      const y = node.attr('y');

      let line = [];
      let lineNumber = 0;
      let word = '';
      let tspan = node.text('')
        .append('tspan')
        .attr('x', x)
        .attr('y', y);

      const addTspan = text => {
        lineNumber += 1;

        return node
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${lineNumber * fontSize}px`)
          .text(text);
      };

      while (words.length > 1) {
        word = words.pop();
        line.push(word);
        tspan.text(line.join(' '));

        const tspanLength = tspan.node().getComputedTextLength();

        if (tspanLength > rectWidth && line.length !== 1) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = addTspan(word);
        }
      }

      addTspan(words.pop());
    });
  }

  resize() {
    this.svg.selectAll('g').remove();
    this.isInit = true;
    this.render(this.data);
  }
}
