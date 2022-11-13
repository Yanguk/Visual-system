import * as d3 from 'd3';
import _ from '../../lib/fp';
import $ from '../../lib/simpleDom';
import './homePage.scss';

const container = _.go(
  $.template('div'),
  $.el,
  $.addClass('homePage'),
  $.addClass('container'),
);

container.innerHTML = `
  <div class="home_top_container">
    <div class="home_cpu_wrapper"></div>
    </div>
  <div class="home_bottom_container"></div>
`;

const cpuWrapper = $.find('.home_cpu_wrapper', container);

// todo: graph 그리기
// eslint-disable-next-line no-unused-vars
const svg = d3.select(cpuWrapper)
  .append('svg');

export default container;
