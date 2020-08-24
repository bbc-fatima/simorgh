import path from 'ramda/src/path';
import pathOr from 'ramda/src/pathOr';
import assocPath from 'ramda/src/assocPath';
import insert from 'ramda/src/insert';

const isParagraphBlock = ({ type, model }) => {
  if (type !== 'text') return false;
  return path(['blocks', 0, 'type'], model) === 'paragraph';
};

const mpuBlock = {
  type: 'mpu',
  model: {},
};

/**
 * Returns `pageData` with an MPU block inserted after the first
 * paragraph block. If `allowAdvertising` is `false` or there is no paragraph
 * block, `pageData` is returned unchanged.
 * @param {Object} pageData A page data object.
 */
const addMpuBlock = pageData => {
  if (!path(['metadata', 'options', 'allowAdvertising'], pageData))
    return pageData;

  const blocks = pathOr([], ['content', 'model', 'blocks'], pageData);
  const firstParagraphIndex = blocks.findIndex(isParagraphBlock);

  if (firstParagraphIndex < 0) return pageData;

  return assocPath(
    ['content', 'model', 'blocks'],
    insert(firstParagraphIndex + 1, mpuBlock, blocks),
    pageData,
  );
};

export default addMpuBlock;
