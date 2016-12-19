/* global */
import './style/index.scss';

import { show, hide, actionOn, actionOff } from './ui';
import { getNodeText, copyTextToClipboard } from './util';
import { googleSearch, baiduSearch } from './action';

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const KEY_CMD = 91;
const KEY_CTRL = 17;
const KEY_ALT = 18;

const BLOCK_TAG = [
  'meta',
  'script',
  'style',
  'link',
];

const BLOCK_CLASSNAMES = ['bb-stage-wp'];

const AVALIABLE_NODE = [
  1, // ELEMENT_NODE
  3, // TEXT_NODE
];

const option = {
  triggerKey: {
    win: KEY_CTRL,
    mac: KEY_CMD,
  },
  actionKey: KEY_ALT,
  defaultJoinChar: ' ',
  delay: 500,
};

let clientX;
let clientY;

// eslint-disable-next-line no-unused-vars
const state = {
  curTask: null,
  isActive: false, // 被激活,
  onAction: false, // 是否处于动作面版
  selectedTexts: [], // 选择的文字
  searchEngine: null,
  joinChar: option.defaultJoinChar,
};

function isTriggerKey(keycode) {
  let trigger = null;
  if (typeof option.triggerKey === 'number') {
    trigger = option.triggerKey;
  } else if (isMac) {
    trigger = option.triggerKey.mac;
  } else {
    trigger = option.triggerKey.win;
  }
  return trigger === keycode;
}

function isActionKey(keycode) {
  let trigger = null;
  if (typeof option.actionKey === 'number') {
    trigger = option.actionKey;
  } else if (isMac) {
    trigger = option.actionKey.mac;
  } else {
    trigger = option.actionKey.win;
  }
  return trigger === keycode;
}

// eslint-disable-next-line no-unused-vars
function getInfoAtPoint(x, y) {
  let range;
  let node;
  let offset;

  if (document.caretPositionFromPoint) {
    range = document.caretPositionFromPoint(x, y);
    node = range.offsetNode;
    offset = range.offset;
  } else if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
    node = range.startContainer;
    offset = range.startOffset;
  }
  return {
    range,
    node,
    offset,
  };
}

function traversDownNode (node, cb) {
  if (AVALIABLE_NODE.indexOf(node.nodeType) < 0 ||
    ~BLOCK_TAG.indexOf(node.nodeName.toLowerCase()) ||
    !!node.classList && BLOCK_CLASSNAMES.some(clz => node.classList.contains(clz))
  ) {
    return [];
  }

  if (!node.childNodes.length) {
    return [node];
  }
  return Array.prototype.reduce.call(node.childNodes, (nodes, childNode) =>
    nodes.concat(traversDownNode(childNode)), [node]);
}

function update_mouse_pos(event) {
  clientX = event.clientX;
  clientY = event.clientY;
}

function clearPreviousState() {
  state.selectedTexts = [];
  state.searchEngine = null,
  state.joinChar = option.defaultJoinChar;
}

// 退出视图
function quit() {
  state.isActive = false;
  state.onAction = false;

  // the trigger is not intent to, just cancel
  if (state.curTask) {
    clearTimeout(state.curTask);
    state.curTask = null;
  }

  // action already handle the text
  // just hide and return
  if (state.selectedTexts.length) {
    hide();
    return;
  }

  // fallback to default process
  state.selectedTexts = hide();
  if (state.selectedTexts.length) {
    const selectedText = state.selectedTexts.join(state.joinChar)
    copyTextToClipboard(selectedText);
    switch (state.searchEngine) {
      case 'bd':
        baiduSearch(selectedText);
        break;
      case 'gg':
        googleSearch(selectedText);
        break;
      default:
        // do nothing
    }
  }
}

function keyDown(event) {
  if (state.curTask) {
    return;
  }

  if (state.isActive) { // 已经激活
    if (!state.onAction && isActionKey(event.keyCode)) {
      state.onAction = true;
      actionOn({
        clientX,
        clientY,
      });
    }
    return;
  }

  if (isTriggerKey(event.keyCode)) {
    state.curTask = setTimeout(() => {
      clearPreviousState();

      const curNode = document.elementFromPoint(clientX, clientY);
      const words = traversDownNode(curNode).map(getNodeText).filter(text =>
        text !== '' /* none empty textnode */
      );
      // const words = textnodes.map(getNodeText);
      show({ words });
      state.isActive = true;
      state.curTask = null;
    }, option.delay);
  }
}

function keyUp(event) {
  if (isTriggerKey(event.keyCode)) {
    quit();
  } else if (isActionKey(event.keyCode)) {
    state.onAction = false;
    const actionInfo = actionOff();
    state.joinChar = actionInfo.joinChar;
    state.searchEngine = actionInfo.searchEngine;
    // state.selectedTexts = actionInfo.textArray;
  }
}

//  can't copy success when window on blur because it's impossible to create selection
// window.addEventListener('blur', quit, false);

document.addEventListener('mousemove', update_mouse_pos, false);
document.addEventListener('keyup', keyUp, false);
document.addEventListener('keydown', keyDown, false);
