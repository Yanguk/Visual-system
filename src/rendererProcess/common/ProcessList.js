import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import $ from '../../lib/simpleDom';

export const processListConfigEnum = {
  SELECT: 'select',
};

export default class ProcessList {
  constructor(parentEl, config) {
    this.parentEl = parentEl;
    this.config = config;
    this.isInit = true;
    this.selectedNode = null;
    this.tableChildNodes = [];
    this.wrapper = _.go(
      $.template('table', ''),
      $.el,
      $.addClass('process-table'),
    );
  }

  render(dataList) {
    if (!this.isInit) {
      this.update(dataList);
      return;
    }

    $.append(this.parentEl, this.wrapper);

    this.tableChildNodes = _.go(
      dataList,
      L.getIndex,
      _.map(([tds, index]) => `
        <tr class="row_${index}" data-id=${tds[1]}>
          ${_.map(([text, j]) => `<${index === 0 ? 'th' : 'td'} class="col_${j}">${text}${j === 4 ? '(KiB)' : ''}</${index ? 'th' : 'td'}>`, L.getIndex(tds)).join('')}
        </tr>
      `),
      ([thead, ...tbody]) => `<thead>${thead}</thead><tbody>${tbody.join('')}</tbody>`,
      $.afterBeginInnerHTML(this.wrapper),
      $.findAll('tr'),
    );

    if (this.config[processListConfigEnum.SELECT]) {
      this.tableChildNodes.forEach((trNode, i) => {
        if (i === 0) {
          return;
        }

        trNode.addEventListener('click', e => {
          $.removeClass('selected', this.selectedNode);
          $.addClass('selected', e.currentTarget);
          this.selectedNode = e.currentTarget;
        });
      });
    }

    this.isInit = false;
  }

  update(newDataList) {
    const selectedPid = this.selectedNode?.dataset.id;
    this.selectedNode?.classList.remove('selected');
    this.selectedNode?.classList.remove('cancel-text');

    this.tableChildNodes.forEach((trNode, i) => {
      if (i === 0) {
        return;
      }

      trNode.childNodes.forEach((tdNode, j) => {
        if (j > 0) {
          tdNode.textContent = newDataList[i][j - 1];
        }

        if (j === 2) {
          trNode.dataset.id = tdNode.textContent;
        }
      });
    });

    this.selectedNode = _.go(
      $.qs(`[data-id="${selectedPid}"]`),
      $.addClass('selected'),
    );
  }
}
