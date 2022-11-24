import $ from '../../lib/simpleDom';
import _ from '../../lib/fp';

import renderHomePage from '../pages/homePage';
import renderCPUPage from '../pages/cpuPage';
import renderMemoryPage from '../pages/memoryPage';
import renderProcessPage from '../pages/processPage';
import renderDiskPage from '../pages/diskPage';
import renderStatsPage from '../pages/statsPage';

const sideNavBar = $.qs('.side-nav-bar');
const navWrapper = $.find('.side-nav-bar-wrapper', sideNavBar);

const pageInfo = {
  home: renderHomePage,
  cpu: renderCPUPage,
  memory: renderMemoryPage,
  disk: renderDiskPage,
  process: renderProcessPage,
  stats: renderStatsPage,
};

const prePage = window.localStorage.getItem('prePage');

let preClear = prePage
  ? pageInfo[prePage]()
  : renderHomePage();

const targetNav = prePage
  ? $.qs(`#${prePage}`)
  : $.qs('#home');

$.addClass('active', targetNav);

const render = e => {
  const navEl = e.currentTarget;

  if (navEl.className.includes('active')) {
    return;
  }

  preClear();
  preClear = pageInfo[navEl.id]();

  _.go(
    $.find('.active', navWrapper),
    $.removeClass('active'),
  );

  _.go(
    navEl,
    $.addClass('active'),
  );
};

const onClick = $.onAddEvent('click');

[...navWrapper.children].forEach(onClick(render));
