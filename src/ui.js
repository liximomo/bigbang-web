import { createELement, on } from './util';
import { wordSegment } from './service';

const stageV = `
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

const actionSheetV = () => `
<div class="bb-action-container">
  <div class="bb-action__pickle-wp">
    <span class="pickle action action-join" data-char="">联结</span>
    <span class="pickle action action-join active" data-char=" ">空格</span>
    <span class="pickle action action-join" data-char="\n">行分割</span>
  </div>
  <div class="bb-action__menu-wp">
    <div class="bb-action__menu-item action action-search" data-se="@null" >
      cancel
    </div>
    <div class="bb-action__menu-item action action-search" data-se="bd" >
      百度
    </div>
    <div class="bb-action__menu-item action action-search" data-se="gg" >
      谷歌
    </div>
  </div>
</div>
`;

const wordV = (props) => `
<span class="bb-word ${props.selected ? 'is-selected' : ''}">${props.text}</span>
`;

const stageWrapper = createELement(stageV);
// const stage = stageWrapper.querySelector('.bb-stage.bb-stage--content');
const wordsStage = stageWrapper.querySelector('.bb-view--words');
const actionStage = stageWrapper.querySelector('.bb-view--action');

function getPosition2Document(e) {
  let posx = 0;
  let posy = 0;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft +
                       document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop +
                       document.documentElement.scrollTop;
  }

  return {
    x: posx,
    y: posy
  };
}

/* eslint-disable no-param-reassign */
function positonMenu(x, y, menu) {
  const leftOffset = 140;
  const topOffset = 30;
  const clickCoordsX = x - leftOffset;
  const clickCoordsY = y - topOffset;

  const menuWidth = menu.offsetWidth + 4;
  const menuHeight = menu.offsetHeight + 4;

  const documentWidth = document.body.clientWidth;
  const documentHeight = document.body.clientHeight;

  if ((documentWidth - clickCoordsX) < menuWidth) {
    menu.style.left = `${documentWidth - menuWidth}px`;
  } else {
    menu.style.left = `${clickCoordsX}px`;
  }

  if ((documentHeight - clickCoordsY) < menuHeight) {
    menu.style.top = `${documentHeight - menuHeight}px`;
  } else {
    menu.style.top = `${clickCoordsY}px`;
  }
}
/* eslint-enable no-param-reassign */

function getWord(wordSpan) {
  return wordSpan.textContent;
}

function words2HtmlText(words, activeIndex = 0) {
  return words.map((word, index) =>
    wordV({
      text: word,
      selected: index === activeIndex,
    })
  ).join('');
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
  const wordSpans = createELement(words2HtmlText(words, -1));
  wordSpans.forEach(wordSpan => wordsContainer.insertBefore(wordSpan, textSpan));
  textSpan.parentNode.removeChild(textSpan);
}

document.body.appendChild(stageWrapper);

// bind event
on('.bb-view--words', 'click', '.bb-word', function() {
  this.classList.toggle('is-selected');
}, false);

let isRequsetPending = false;
on('.bb-view--words', 'contextmenu', '.bb-word', function(event) {
  event.preventDefault();
  if (isRequsetPending) {
    return;
  }
  isRequsetPending = true;
  wordSegmentBusy(this);
  wordSegment(getWord(this), (err, words) => {
    wordSegmentDone(this);
    isRequsetPending = false;
    if (err) {
      wordSegmentFail(this);
      return;
    }
    bigbang(wordsStage, this, words);
  });
}, false);

// action value
let joinChar;
let searchEngine;

function resetAction() {
  joinChar = ' ';
  searchEngine = null;
  actionStage.innerHTML = actionSheetV();
}

on('.bb-view--action', 'mouseover', '.action-join', function() {
  const cur = this;
  Array.prototype.filter.call(actionStage.querySelectorAll('.action-join'), action =>
    action !== cur
  ).forEach(action => action.classList.remove('active'));
  cur.classList.add('active');
  joinChar = cur.dataset.char;
}, false);

on('.bb-view--action', 'mouseover', '.action-search', function() {
  const cur = this;
  Array.prototype.filter.call(actionStage.querySelectorAll('.action-search'), action =>
    action !== cur
  ).forEach(action => action.classList.remove('active'));
  cur.classList.add('active');
  searchEngine = cur.dataset.se;
}, false);

function getAllSelectText() {
  const selectedTexts = stageWrapper.querySelectorAll('.bb-word.is-selected');
  const selectedTextArray = Array.prototype.slice.call(selectedTexts).map(getWord);
  return selectedTextArray;
}

export { getWord };

export function actionOn(opt) {
  // clear value
  resetAction();

  const pos = getPosition2Document(opt);
  positonMenu(pos.x, pos.y, actionStage);
  stageWrapper.classList.add('on-action');
}

export function actionOff() {
  stageWrapper.classList.remove('on-action');
  return {
    joinChar,
    searchEngine,
    textArray: getAllSelectText(),
  };
}

export function show({ words }) {
  wordsStage.innerHTML = words2HtmlText(words);
  stageWrapper.classList.add('is-active');
}

export function hide() {
  stageWrapper.classList.remove('is-active');
  const selectedTextArray = getAllSelectText();
  wordsStage.innerHTML = '';
  actionOff();
  return selectedTextArray;
}
