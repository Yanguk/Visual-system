/* eslint-disable no-sequences */
import { curry } from './fp/util';

const qs = (target, parent = document) => parent.querySelector(target);
const qsAll = (target, parent = document) => parent.querySelectorAll(target);

const find = curry(qs);
const findAll = curry(qsAll);

const el = html => {
  const wrapper = document.createElement('div');
  wrapper.insertAdjacentHTML('afterbegin', html);

  return wrapper.children[0];
};

const append = curry((parent, child) => (parent.appendChild(child), child));

const afterBeginInnerHTML = curry((parent, html) => (parent.insertAdjacentHTML('afterbegin', html), parent));

const template = curry((tag, value = '') => `<${tag}>${value}</${tag}>`);

const templateClass = (tag, ...rest) => {
  const classList = rest.join(' ');

  return value => `<${tag} class="${classList}">${value}</${tag}>`;
};

const chain = f => (value, target) => (f(value, target), target);

const addClass = curry(chain((value, element) => element?.classList.add(value)));

const removeClass = curry(chain((value, element) => element?.classList.remove(value)));

const onAddEvent = eventName => curry(
  chain((f, element) => element.addEventListener(eventName, f)),
);

const $ = {
  qs,
  find,
  findAll,
  qsAll,
  el,
  append,
  template,
  addClass,
  removeClass,
  onAddEvent,
  templateClass,
  afterBeginInnerHTML,
};

export default $;
