export default class StepIntervalHandler {
  constructor(step) {
    this.step = step;
    this.index = -1;
    this.fnList = [];
  }

  insert(f) {
    this.fnList.push(f);
  }

  update(data) {
    if (++this.index === 0) {
      this.fnList.forEach(f => f(data));
    }

    if (this.index === this.step) {
      this.index = -1;
    }
  }
}
