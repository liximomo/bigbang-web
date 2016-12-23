// ==UserScript==
// @name         big-bang
// @homepageURL  https://github.com/liximomo/bigbang-web
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  bigbang word segment and smart copy
// @author       liximomo
// @match        http*://*/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      wordsegment-153208.appspot.com
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/bigbang-web/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__textExtractor__ = __webpack_require__(1);
/* harmony export (immutable) */ exports["d"] = param;
/* unused harmony export flatten */
/* harmony export (immutable) */ exports["c"] = createELement;
/* harmony export (immutable) */ exports["b"] = on;
/* harmony export (immutable) */ exports["a"] = copyTextToClipboard;


function param(object) {
  return Object.keys(object).map(key => `${ key }=${ encodeURIComponent(object[key]) }`, '').join('&');
}

function flatten(array) {
  if (!array.length) {
    return array;
  }
  return array.reduce((arr, item) => arr.concat(flatten(item)), []);
}

// dom
function createELement(string) {
  var wpEL = document.createElement('div');

  // remove line breaks from start and end of string
  // trim isn't reliable 
  wpEL.innerHTML = string.replace(/^\s+|\s+$/g, '');
  var el = void 0;
  if (wpEL.childNodes.length === 1) {
    el = wpEL.childNodes[0];
  } else {
    el = Array.prototype.slice.call(wpEL.childNodes);
  }
  wpEL.innerHTML = '';
  return el;
}

function on(elSelector, eventName, selector, handler, useCapture) {
  var _useCapture = useCapture === undefined ? false : useCapture;
  var elements = document.querySelectorAll(elSelector);
  var addEventListener = function addEventListener(element) {
    element.addEventListener(eventName, function (e) {
      for (var target = e.target; target && target !== this; target = target.parentNode) {
        // loop parent nodes from the target to the delegation node
        var match = false;
        if (target.matches) {
          match = target.matches(selector);
        } else if (target.webkitMatchesSelector) {
          match = target.webkitMatchesSelector(selector);
        } else if (target.mozMatchesSelector) {
          match = target.mozMatchesSelector(selector);
        } else if (target.msMatchesSelector) {
          match = target.msMatchesSelector(selector);
        } else if (target.oMatchesSelector) {
          match = target.oMatchesSelector(selector);
        }
        if (match) {
          handler.call(target, e);
          break;
        }
      }
    }, _useCapture);
  };
  Array.prototype.forEach.call(elements, addEventListener);
}

function copyTextToClipboard(text) {
  if (typeof GM_setClipboard !== 'undefined') {
    GM_setClipboard(text, 'text');
    return;
  }

  var textArea = document.createElement('textarea');
  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  var success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error(err);
  }

  document.body.removeChild(textArea);
  return success;
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = textContent;
var extractMap = {};

function register(nodeName, extract) {
  extractMap[nodeName] = extract;
}

register('input', node => node.value);

function textContent(node) {
  var text = '';
  if (node.nodeType === 3) {
    text = node.textContent;
  } else {
    var nodeName = node.nodeName.toLowerCase();
    var tractor = extractMap[nodeName];
    if (tractor) {
      text = tractor(node);
    }
  }
  return text.trim();
}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__textExtractor__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__action__ = __webpack_require__(3);
/* global */





var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

var KEY_CMD = 91;
var KEY_CTRL = 17;
var KEY_ALT = 18;

var BLOCK_TAG = ['meta', 'script', 'style', 'link', 'noscript'];

var BLOCK_CLASSNAMES = ['bb-stage-wp'];

var AVALIABLE_NODE = [1, // ELEMENT_NODE
3];

var option = {
  triggerKey: {
    win: KEY_CTRL,
    mac: KEY_CMD
  },
  actionKey: KEY_ALT,
  defaultJoinChar: ' ',
  dumpActionDelay: 1200, // ms
  smartActionDelay: 300
};

var clientX = void 0;
var clientY = void 0;

// eslint-disable-next-line no-unused-vars
var state = {
  curTask: null,
  willActive: false, // 将被激活，当前等价于 triggerKey 被按下
  isActive: false, // 被激活, app 视图出现
  onAction: false, // 是否处于动作面版
  selectedTexts: [], // 选择的文字
  searchEngine: null,
  joinChar: option.defaultJoinChar
};

function isTriggerKey(keycode) {
  var trigger = null;
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
  var trigger = null;
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
  var range = void 0;
  var node = void 0;
  var offset = void 0;

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
    offset
  };
}

function traversDownNode(node, cb) {
  if (AVALIABLE_NODE.indexOf(node.nodeType) < 0 || ~BLOCK_TAG.indexOf(node.nodeName.toLowerCase()) || !!node.classList && BLOCK_CLASSNAMES.some(clz => node.classList.contains(clz))) {
    return [];
  }

  if (!node.childNodes.length) {
    return [node];
  }
  return Array.prototype.reduce.call(node.childNodes, (nodes, childNode) => nodes.concat(traversDownNode(childNode)), [node]);
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
    text: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__textExtractor__["a" /* default */])(node),
    node
  };
}

function activate() {
  clearPreviousState();

  var curNode = document.elementFromPoint(clientX, clientY);
  var words = traversDownNode(curNode).map(textNode).filter((_ref) => {
    var text = _ref.text;
    return text !== '';
  } /* none empty textnode */
  );

  if (!words.length) {
    // 没有文字可以选择，什么都不做
  } else if (words.length === 1) {
    // 只有一段可选择文字，进入smart mode
    var word = words[0];
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* copyTextToClipboard */])(word.text);

    // ui提示用户当前被复制的文字
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ui__["a" /* hint */])(word.node, option.dumpActionDelay);

    // 一定时间后，用户没有取消，进入full mode
    state.curTask = setTimeout(() => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ui__["b" /* show */])({ words }), option.dumpActionDelay);
  } else {
    // 进入full mode
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ui__["b" /* show */])({ words });
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
  state.selectedTexts = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ui__["c" /* hide */])();
  if (state.selectedTexts.length) {
    var selectedText = state.selectedTexts.join(state.joinChar);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* copyTextToClipboard */])(selectedText);
    switch (state.searchEngine) {
      case 'bd':
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__action__["a" /* baiduSearch */])(selectedText);
        break;
      case 'gg':
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__action__["b" /* googleSearch */])(selectedText);
        break;
      default:
      // do nothing
    }
  }
}

function keyDown(event) {
  // 已经激活 app

  if (state.isActive) {
    // 已经激活
    if (!state.onAction && isActionKey(event.keyCode)) {
      state.onAction = true;
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ui__["d" /* actionOn */])({
        clientX,
        clientY
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
  } else if (isActionKey(event.keyCode)) {
    state.onAction = false;
    var actionInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ui__["e" /* actionOff */])();
    state.joinChar = actionInfo.joinChar;
    state.searchEngine = actionInfo.searchEngine;
  }
}

if (true) {
  // auto quit when lose focus
  window.addEventListener('blur', quit, false);
}

document.addEventListener('mousemove', update_mouse_pos, false);
document.addEventListener('keyup', keyUp, false);
document.addEventListener('keydown', keyDown, false);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony export (immutable) */ exports["a"] = baiduSearch;
/* harmony export (immutable) */ exports["b"] = googleSearch;


var WINDOW_NAME = 'bbSearchWindow';

function baiduSearch(text) {
  var urlParam = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["d" /* param */])({
    wd: text
  });

  window.open(`https://www.baidu.com/s?${ urlParam }`, WINDOW_NAME);
}

function googleSearch(text) {
  var urlParam = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["d" /* param */])({
    q: text
  });
  window.open(`https://www.google.com.hk/search?${ urlParam }`, WINDOW_NAME);
}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var api_key = 'h9s2c4R62DjucGFfLpdfiyuK0pPMyoicLw3PAOhC';
/* unused harmony default export */ var _unused_webpack_default_export = api_key;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_key__ = __webpack_require__(4);
/* harmony export (immutable) */ exports["a"] = wordSegment;
// 分词服务 返回词语数据



var isProd = "production" === 'production';

var service_host = 'https://wordsegment-153208.appspot.com/ws';

var TIMEOUT = 1000 * 6;

function callApi(url, params, cb) {
  if (isProd) {
    xhr(url, params, cb);
    return;
  } else {
    // 无法跨域访问，模拟调用成功
    return cb(null, params.text.split(''));
  }
}

function xhr(url, params, cb) {
  var urlParam = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["d" /* param */])(params);
  GM_xmlhttpRequest({
    method: 'GET',
    url: `${ url }?${ urlParam }`,
    timeout: TIMEOUT,
    responseType: 'json',
    onload: data => {
      if (data.status === 200) {
        cb(null, data.response);
      } else {
        cb(new Error('service is not available'));
      }
    },
    onerror: () => cb(new Error('fail')),
    ontimeout: () => cb(new Error('timeout'))
  });
}

function wordSegment(text, cb) {
  callApi(service_host, {
    text
  }, (err, words) => err ? cb(err) : cb(null, words));
}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service__ = __webpack_require__(5);
/* unused harmony export getWord */
/* harmony export (immutable) */ exports["a"] = hint;
/* unused harmony export prepareView */
/* harmony export (immutable) */ exports["d"] = actionOn;
/* harmony export (immutable) */ exports["e"] = actionOff;
/* harmony export (immutable) */ exports["b"] = show;
/* harmony export (immutable) */ exports["c"] = hide;



var stageWrapper = void 0;
var wordsView = void 0;
var actionStage = void 0;
var actionView = void 0;

var isRequsetPending = false;

// action value
var actinoStatus = {};

var stageV = `
<div class='bb-stage-wp'>
  <div class='bb-stage bb-stage--content'>
    <div class="bb-view bb-view--words"></div>
  </div>
  <div class='bb-stage bb-stage--action'>
    <div class="bb-view bb-view--action">
    </div>
  </div>
</div>
`;

var actionSheetV = () => `
<div class="bb-action-container">
  <div class="bb-action__pickle-wp">
    <span class="pickle action action-join" data-char="">联结</span>
    <span class="pickle action action-join active" data-char=" ">空格</span>
    <span class="pickle action action-join" data-char="\n">行分割</span>
  </div>
  <div class="bb-action__menu-wp">
    <div class="bb-action__menu-item action action-search" data-se="gg" >
      谷歌
    </div>
    <div class="bb-action__menu-item action action-search" data-se="bd" >
      百度
    </div>
    <div class="bb-action__menu-item action action-search action-cancel" data-se="@null" >
      cancel
    </div>
  </div>
</div>
`;

var wordV = props => `
<span class="bb-word ${ props.selected ? 'is-selected' : '' }">${ props.text }</span>
`;

function getPosition2Document(e) {
  var posx = 0;
  var posy = 0;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX;
    posy = e.clientY;
  }

  return {
    x: posx,
    y: posy
  };
}

/* eslint-disable no-param-reassign */
function positonMenu(x, y, menu) {
  var leftOffset = 130;
  var topOffset = 60;
  var clickCoordsX = x - leftOffset;
  var clickCoordsY = y - topOffset;

  var menuWidth = menu.offsetWidth + 4;
  var menuHeight = menu.offsetHeight + 4;

  var documentWidth = actionStage.clientWidth;
  var documentHeight = actionStage.clientHeight;

  if (documentWidth - clickCoordsX < menuWidth) {
    menu.style.left = `${ documentWidth - menuWidth }px`;
  } else {
    menu.style.left = `${ clickCoordsX }px`;
  }

  if (documentHeight - clickCoordsY < menuHeight) {
    menu.style.top = `${ documentHeight - menuHeight }px`;
  } else {
    menu.style.top = `${ clickCoordsY }px`;
  }
}
/* eslint-enable no-param-reassign */

function resetAction() {
  actinoStatus.joinChar = ' ';
  actinoStatus.searchEngine = null;
  actionView.innerHTML = actionSheetV();
}

// bind event
function bindEvent() {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* on */])('.bb-view--words', 'click', '.bb-word', function () {
    this.classList.toggle('is-selected');
  }, false);

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* on */])('.bb-view--words', 'contextmenu', '.bb-word', function (event) {
    event.preventDefault();
    if (isRequsetPending) {
      return;
    }
    isRequsetPending = true;
    wordSegmentBusy(this);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__service__["a" /* wordSegment */])(getWord(this), (err, words) => {
      wordSegmentDone(this);
      isRequsetPending = false;
      if (err) {
        wordSegmentFail(this);
        return;
      }
      bigbang(wordsView, this, words);
    });
  }, false);

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* on */])('.bb-view--action', 'mouseover', '.action-join', function () {
    var cur = this;
    Array.prototype.filter.call(actionView.querySelectorAll('.action-join'), action => action !== cur).forEach(action => action.classList.remove('active'));
    cur.classList.add('active');
    actinoStatus.joinChar = cur.dataset.char;
  }, false);

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* on */])('.bb-view--action', 'mouseover', '.action-search', function () {
    var cur = this;
    Array.prototype.filter.call(actionView.querySelectorAll('.action-search'), action => action !== cur).forEach(action => action.classList.remove('active'));
    cur.classList.add('active');
    actinoStatus.searchEngine = cur.dataset.se;
  }, false);
}

function getWord(wordSpan) {
  return wordSpan.textContent;
}

function words2HtmlText(words) {
  var activeIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return words.map((text, index) => wordV({
    text: text,
    selected: index === activeIndex
  })).join('');
}

function wordSegmentDone(textSpan) {
  textSpan.classList.remove('busy');
}

function wordSegmentFail(textSpan) {
  textSpan.classList.add('shake');
  textSpan.addEventListener('animationend', () => textSpan.classList.remove('shake'), false);
}

function wordSegmentBusy(textSpan) {
  textSpan.classList.add('busy');
}

function bigbang(wordsContainer, textSpan, words) {
  if (words.length <= 1) {
    wordSegmentFail(textSpan);
    return;
  }
  // eslint-disable-next-line no-param-reassign
  textSpan.style.display = 'none';
  var wordSpans = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* createELement */])(words2HtmlText(words, -1));
  wordSpans.forEach(wordSpan => wordsContainer.insertBefore(wordSpan, textSpan));
  textSpan.parentNode.removeChild(textSpan);
}

function getAllSelectText() {
  var selectedTexts = stageWrapper.querySelectorAll('.bb-word.is-selected');
  var selectedTextArray = Array.prototype.slice.call(selectedTexts).map(getWord);
  return selectedTextArray;
}

function injectStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.head.appendChild(node);
}



function hint(node, duration, cb) {
  // clear value
  var containerNode = node;
  if (node.nodeType === 3) {
    containerNode = node.parentNode;
  }

  containerNode.style.animationDuration = `${ duration / 1000 }s`;
  containerNode.classList.add('bb-hint');
  containerNode.addEventListener('animationend', () => containerNode.classList.remove('bb-hint'), false);
}

function prepareView() {
  var isExist = document.querySelector('.bb-stage-wp');
  if (isExist) {
    return;
  }
  var style = __webpack_require__(7);
  injectStyleString(style[0][1]);
  stageWrapper = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* createELement */])(stageV);
  wordsView = stageWrapper.querySelector('.bb-view--words');
  actionStage = stageWrapper.querySelector('.bb-stage--action');
  actionView = stageWrapper.querySelector('.bb-view--action');
  document.body.appendChild(stageWrapper);
  bindEvent();
}

function actionOn(opt) {
  // clear value
  resetAction();

  var pos = getPosition2Document(opt);
  positonMenu(pos.x, pos.y, actionView);
  stageWrapper.classList.add('on-action');
}

function actionOff() {
  stageWrapper.classList.remove('on-action');
  return actinoStatus;
}

function show(_ref) {
  var words = _ref.words;

  prepareView();
  wordsView.innerHTML = words2HtmlText(words.map(word => word.text));
  stageWrapper.classList.add('is-active');
}

function hide() {
  if (!stageWrapper) return [];

  stageWrapper.classList.remove('is-active');
  var selectedTextArray = getAllSelectText();
  wordsView.innerHTML = '';
  actionOff();
  return selectedTextArray;
}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)();
// imports


// module
exports.push([module.i, ".bb-stage-wp {\n  position: relative;\n  font-size: 16px !important;\n  color: #000 !important; }\n  .bb-stage-wp .bb-stage {\n    opacity: 0;\n    visibility: hidden;\n    position: fixed;\n    z-index: 9999;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0; }\n  .bb-stage-wp.is-active .bb-stage {\n    transition: opacity 0.2s ease-out; }\n  .bb-stage-wp.is-active .bb-stage--content {\n    overflow-y: auto;\n    opacity: 1;\n    visibility: visible;\n    background: linear-gradient(to left, #DAE2F8, #D6A4A4); }\n  .bb-stage-wp.bb-stage-wp.on-action .bb-stage--content {\n    transition: -webkit-filter .2s ease-out;\n    transition: filter .2s ease-out;\n    transition: filter .2s ease-out, -webkit-filter .2s ease-out;\n    -webkit-filter: blur(10px);\n            filter: blur(10px); }\n  .bb-stage-wp.bb-stage-wp.on-action .bb-stage--action {\n    opacity: 1;\n    visibility: visible; }\n  .bb-stage-wp .bb-view {\n    position: absolute; }\n  .bb-stage-wp .bb-view--action {\n    position: absolute;\n    box-shadow: 0 0 30px -5px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;\n    border-radius: 5px; }\n  .bb-stage-wp .bb-view--words {\n    top: 50%;\n    left: 50%;\n    transform: translate3d(-50%, -50%, 0);\n    max-width: 800px;\n    max-height: 100%; }\n  .bb-stage-wp .bb-word {\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n    display: inline-block;\n    padding: 6px 10px;\n    border-radius: 5px;\n    line-height: 1.5;\n    margin: 5px;\n    box-shadow: 0 0 1px 1px rgba(142, 132, 131, 0.55); }\n    .bb-stage-wp .bb-word.is-selected {\n      background: #009688;\n      color: #d2cece; }\n  .bb-stage-wp .bb-action-container,\n  .bb-stage-wp .bb-action__menu-wp {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-content: center; }\n  .bb-stage-wp .action {\n    cursor: pointer;\n    min-width: 80px; }\n    .bb-stage-wp .action.active:not(.action-cancel) {\n      color: #009688;\n      text-shadow: 0 2px 4px #009688; }\n  .bb-stage-wp .pickle {\n    margin: 12px 0;\n    padding: 0 12px;\n    text-align: center; }\n    .bb-stage-wp .pickle + .pickle {\n      border-left: 1px solid rgba(255, 255, 255, 0.39); }\n    .bb-stage-wp .pickle:first-child {\n      border-right-width: 0;\n      border-top-left-radius: 10px;\n      border-bottom-left-radius: 10px; }\n    .bb-stage-wp .pickle:last-child {\n      border-top-right-radius: 10px;\n      border-bottom-right-radius: 10px; }\n  .bb-stage-wp .bb-action__pickle-wp {\n    display: flex;\n    justify-content: center; }\n  .bb-stage-wp .bb-action__menu-wp {\n    margin-top: 10px;\n    display: flex;\n    justify-content: center;\n    align-content: center; }\n  .bb-stage-wp .bb-action__menu-item {\n    margin: 0 24px;\n    padding: 12px 0;\n    border-top: 1px solid rgba(255, 255, 255, 0.39);\n    text-align: center; }\n  .bb-stage-wp .busy {\n    animation-name: bbPulse;\n    animation-fill-mode: both;\n    animation-timing-function: ease-in-out;\n    animation-duration: 1.2s;\n    animation-iteration-count: infinite; }\n  .bb-stage-wp .shake {\n    animation-timing-function: ease-in-out;\n    animation-name: bbHeadShake;\n    animation-duration: 0.6s;\n    animation-fill-mode: both; }\n\n.bb-hint {\n  animation-timing-function: ease-in !important;\n  animation-name: bbFade !important;\n  background-image: none !important; }\n\n@keyframes bbFade {\n  0% {\n    background-color: rgba(0, 150, 136, 0.4); }\n  100% {\n    background-color: white; } }\n\n@keyframes bbHeadShake {\n  0% {\n    transform: translateX(0); }\n  6.5% {\n    transform: translateX(-6px) rotateY(-9deg); }\n  18.5% {\n    transform: translateX(5px) rotateY(7deg); }\n  31.5% {\n    transform: translateX(-3px) rotateY(-5deg); }\n  43.5% {\n    transform: translateX(2px) rotateY(3deg); }\n  50% {\n    transform: translateX(0); } }\n\n@keyframes bbPulse {\n  from {\n    transform: scale3d(1, 1, 1); }\n  50% {\n    transform: scale3d(1.05, 1.05, 1.05); }\n  to {\n    transform: scale3d(1, 1, 1); } }\n", ""]);

// exports


/***/ },
/* 8 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map