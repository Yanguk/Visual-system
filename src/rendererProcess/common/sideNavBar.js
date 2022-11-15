import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import $ from '../../lib/simpleDom';
import renderHomePage from '../pages/homePage';
import renderCPUPage from '../pages/cpuPage';

const root = $.qs('#root');

let preClear = renderHomePage();

const sideNavBar = $.qs('.sideNavBar');
const navWrapper = $.find('.sideNavBar__wrapper', sideNavBar);

const mockElArr = _.go(
  L.range(5),
  _.map(num => $.template('div', num)),
  _.map($.el),
  _.map($.addClass('container')),
  _.takeAll,
);

// eslint-disable-next-line func-names
const elementTest = el => {
  const element = el;

  $.append(root, element);

  return () => {
    element.remove();
  };
};

// todo: 페이지 갈아끼우기
const pageInfo = {
  home: renderHomePage,
  cpu: renderCPUPage,
  memory: () => elementTest(mockElArr[1]),
  disk: () => elementTest(mockElArr[2]),
  process: () => elementTest(mockElArr[3]),
  stats: () => elementTest(mockElArr[4]),
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
