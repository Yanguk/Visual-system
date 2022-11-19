import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

library.add(
  faCompactDisc,
);
// eslint-disable-next-line import/prefer-default-export
export const disk = icon({ prefix: 'fas', iconName: 'compact-disc' }).html;
