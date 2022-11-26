import _ from '../../lib/fp/underDash';
import $ from '../../lib/simpleDom';
import L from '../../lib/fp/lazy';

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

    const [theadData, ...tbodyData] = dataList;

    const thead = _.go(
      theadData,
      ([a, b, c, d, e, f]) => [a, b, 'CPU%', 'MEM%', 'RSS(KiB)', f],
      L.getIndex,
      _.map(([text, j]) => `<th class="col_${j}">${text}</th>`),
      ths => `<thead><tr class="row_0">${ths.join('')}</tr></thead>`,
    );

    const tbody = _.go(
      tbodyData,
      L.getIndex,
      _.map(([tds, index]) => `
        <tr class="row_${index + 1}" data-id=${tds[1]}>
          ${_.map(([text, j]) => `<td class="col_${j}">${text}</td>`, L.getIndex(tds)).join('')}
        </tr>
      `),
      trs => `<tbody>${trs.join('')}</tbody>`,
    );

    const tableTemplate = thead + tbody;

    $.afterBeginInnerHTML(this.wrapper, tableTemplate);

    this.tableChildNodes = $.qsAll('tr', this.wrapper);

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
