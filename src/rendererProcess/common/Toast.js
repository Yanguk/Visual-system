import $ from '../../lib/simpleDom';

export default class Toast {
  constructor(className) {
    this.root = $.qs('#root');
  }

  render(message, color = 'white', time = 2000) {
    const element = $.el(`
      <div class="toastWrapper">
        <p class="toastText" style="color:${color}";>${message}</p>
      </div>
    `);

    $.append(this.root, element);

    setTimeout(() => element.remove(), time);
  }
}
