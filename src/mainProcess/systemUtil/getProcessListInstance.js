import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import Observer from '../../lib/Observer';

const util = require('node:util');
// eslint-disable-next-line no-unused-vars
const exec = util.promisify(require('node:child_process').exec);

export class ProcessInfo extends Observer {
  constructor(window) {
    super();

    this.window = window;
    this.data = [];
    this.interval = null;
  }

  startInterval(time = 1000) {
    this.interval = setInterval(async () => {
      this.notify('interval', this);
      // toDo: 추후 데이터 저장 로직 작업시 변경 필요
      if (this.data.length === 60) {
        this.data = this.data.slice(-2);
      }
    }, time);
  }

  removeInterval() {
    clearInterval(this.interval);
  }

  // todo: 프로세스 리스트 가져오기
  async getProcessList() {
    return this;
  }
}

const getProcessListInstance = makeSingleTonFactory(ProcessInfo);

export default getProcessListInstance;
