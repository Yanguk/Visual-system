import $ from './simpleDom';
import { screen } from '@testing-library/dom';

describe('simpleDom 함수 테스트', () => {
  describe('template Test, html템플릿을 만들어 줍니다.', () => {
    test('$.template', () => {
      const testTemplate = `<div>Test</div>`;

      const targetTemplate = $.template('div', 'Test');

      expect(testTemplate).toEqual(targetTemplate);
    });

    test('$.templateClass', () => {
      const testTemplate = `
        <div class="container test main jest">Test</div>
      `;

      const targetClassTemplateFn = $.templateClass(
        'div', 'container', 'test', 'main', 'jest',
      );

      const htmlTemplate = targetClassTemplateFn('Test');

      expect(testTemplate.trim()).toEqual(htmlTemplate.trim());
    });
  });

  describe('$.qs, document.querySelector 와 같은 기능을 수행합니다.', () => {
    test('$.qs', () => {
      const mainId = '#root';
      const mainElement = document.querySelector(mainId);
      const qsMainElement = $.qs(mainId);

      expect(mainElement).toEqual(qsMainElement);
    });
  });
});
