import _ from '../../../lib/fp';
import L from '../../../lib/fp/lazy';
import $ from '../../../lib/simpleDom';
import homePageContainer from '../../pages/homePage';

const root = $.qs('#root');
$.append(root, homePageContainer);

const sideNavBar = $.qs('.sideNavBar');
const navWrapper = $.find('.sideNavBar__wrapper', sideNavBar);

const mockElArr = _.go(
  L.range(5),
  _.map(num => $.template('div', num)),
  _.map($.el),
  _.map($.addClass('container')),
  _.takeAll,
);

// todo: 페이지 갈아끼우기
const pageInfo = {
  home: homePageContainer,
  cpu: mockElArr[0],
  memory: mockElArr[1],
  disk: mockElArr[2],
  process: mockElArr[3],
  stats: mockElArr[4],
};

const render = e => {
  const navEl = e.currentTarget;
  const page = pageInfo[navEl.id];
  const container = $.find('.container', root);

  if (container === page) {
    return;
  }

  _.go(
    $.find('.active', navWrapper),
    $.removeClass('active'),
  );

  container.remove();

  _.go(
    navEl,
    $.addClass('active'),
  );

  $.append(root, page);
};

const onClick = $.getAddEvent('click');

[...navWrapper.children].forEach(onClick(render));
