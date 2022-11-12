import { curry } from './fp';

const qs = (target, parent = document) => document.querySelector.bind(parent);

const qsAll = document.querySelectorAll.bind(document);

const el = html => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();

  return wrapper.children[0];
};

const append = curry((parent, child) => parent.appendChild(child));

const template = (tag, value) => `<${tag}>${value}</${tag}>`;

const addClass = curry((value, el) => (el.classList.add(value), el));

export default {
  qs,
  qsAll,
  el,
  append,
  template,
  addClass,
};
