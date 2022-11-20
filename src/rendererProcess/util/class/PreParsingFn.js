import _ from '../../../lib/fp';
import { push } from '../../../lib/fp/util';

export default class PreParsingFn {
  constructor(...fs) {
    this.fnList = fs;
    this.subscriber = [];
  }

  insertPreFn(...fs) {
    _.each(push(this.fnList), fs);
  }

  subscribe(f) {
    this.subscriber.push(f);
  }

  sendParsingData(data) {
    const parsingData = _.go(data, ...this.fnList);
    _.each(f => f(parsingData), this.subscriber);
  }

  removeSubScriber() {
    this.subscriber.length = 0;
  }

  removePreParsing() {
    this.fnList.length = 0;
  }
}
