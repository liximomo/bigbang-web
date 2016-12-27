/* global */
import { prepareView, show, hide, hint, actionOn, actionOff } from './ui';
import { copyTextToClipboard } from './util';
import textContent from './textExtractor';
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
  'noscript',
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
  dumpActionDelay: 1200, // ms
  smartActionDelay: 300,
};

let clientX;
let clientY;

// eslint-disable-next-line no-unused-vars
const state = {
  curTask: null,
  willActive: false, // 将被激活，当前等价于 triggerKey 被按下
  isActive: false, // 被激活, app 视图出现
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
  state.curTask = null;
  state.selectedTexts = [];
  state.searchEngine = null;
  state.joinChar = option.defaultJoinChar;
}

function textNode(node) {
  return {
    text: textContent(node),
    node,
  };
}

function activate() {
  clearPreviousState();

  const curNode = document.elementFromPoint(clientX, clientY);
  const words = traversDownNode(curNode).map(textNode).filter(({ text }) =>
    text !== '' /* none empty textnode */
  );

  if (!words.length) {
    // 没有文字可以选择，什么都不做
  } else if (words.length === 1) {
    // 只有一段可选择文字，进入smart mode
    const word = words[0];
    copyTextToClipboard(word.text);

    // ui提示用户当前被复制的文字
    hint(word.node, option.dumpActionDelay);

    // 一定时间后，用户没有取消，进入full mode
    state.curTask = setTimeout(() => show({ words }), option.dumpActionDelay);
  } else {
    // 进入full mode
    show({ words });
  }
  // const words = textnodes.map(getNodeText);

  state.willActive = false; // already active so set to false
  state.isActive = true;
}

// 退出视图
function quit() {
  state.willActive = false;
  state.isActive = false;
  state.onAction = false;

  // the trigger is not intent to, just cancel
  if (state.curTask) {
    clearTimeout(state.curTask);
    state.curTask = null;
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
  // 已经激活 app

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
    state.willActive = true;
    if (!state.curTask) {
      state.curTask = setTimeout(activate, option.smartActionDelay);
    }
  } else {
    // other key down, indicate a another key combination
    if (state.willActive) {
      quit(); // stop trigger self, just quit
    }
  }
}

function keyUp(event) {
  if (isTriggerKey(event.keyCode)) {
    quit();
  } else if (state.isActive && isActionKey(event.keyCode)) {
    state.onAction = false;
    const actionInfo = actionOff();
    state.joinChar = actionInfo.joinChar;
    state.searchEngine = actionInfo.searchEngine;
  }
}


if (process.env.NODE_ENV === 'production') {
  // auto quit when lose focus
  window.addEventListener('blur', quit, false);
}

document.addEventListener('mousemove', update_mouse_pos, false);
document.addEventListener('keyup', keyUp, false);
document.addEventListener('keydown', keyDown, false);
