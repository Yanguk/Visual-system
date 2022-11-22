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
          const selectedNode = $.qs('.selected');
          $.removeClass('selected', selectedNode);
          $.addClass('selected', e.currentTarget);
        });
      });
    }

    this.isInit = false;
  }

  update(newDataList) {
    const selectedNode = $.qs('.selected');
    const selectedPid = selectedNode?.dataset.id;
    selectedNode?.classList.remove('selected');
    selectedNode?.classList.remove('cancel-text');

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

    _.go(
      $.qs(`[data-id="${selectedPid}"]`),
      $.addClass('selected'),
    );
  }
}
