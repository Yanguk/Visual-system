import { curry } from "./fp/util";

const qs = (target, parent = document) => parent.querySelector(target);
const qsAll = (target, parent = document) => parent.querySelectorAll(target);

const find = curry(qs);
const findAll = curry(qsAll);

const el = html => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();

  return wrapper.children[0];
};

const append = curry((parent, child) => parent.appendChild(child));

const template = (tag, value = "") => `<${tag}>${value}</${tag}>`;

const addClass = curry((value, el) => (el.classList.add(value), el));
const removeClass = curry((value, el) => (el.classList.remove(value), el));

const getAddEvent = (eventName) => curry((f, el) => (el.addEventListener(eventName, f), el));

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
  getAddEvent,
};

export default $;
