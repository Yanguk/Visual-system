import _ from '../../lib/fp';
import $ from '../../lib/simpleDom';
import renderHomePage from '../pages/homePage';
import renderCPUPage from '../pages/cpuPage';
import renderProcessPage from '../pages/processPage';
import renderDiskPage from '../pages/diskPage';
import renderMemoryPage from '../pages/memoryPage';
import renderStatsPage from '../pages/statsPage';

let preClear = renderHomePage();

const sideNavBar = $.qs('.sideNavBar');
const navWrapper = $.find('.sideNavBar__wrapper', sideNavBar);

const pageInfo = {
  home: renderHomePage,
  cpu: renderCPUPage,
  memory: renderMemoryPage,
  disk: renderDiskPage,
  process: renderProcessPage,
  stats: renderStatsPage,
};

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

const onClick = $.getAddEvent('click');

[...navWrapper.children].forEach(onClick(render));
