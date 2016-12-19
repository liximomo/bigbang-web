import textContent from './textExtractor';

export function param(object) {
  return Object.keys(object)
    .map(key => `${key}=${encodeURIComponent(object[key])}`, '').join('&');
}

export function flatten(array) {
  if (!array.length) {
    return array;
  }
  return array.reduce((arr, item) => arr.concat(flatten(item)), []);
}

// dom
export function createELement(string) {
  const wpEL = document.createElement('div');
  wpEL.innerHTML = string.trim();
  let el;
  if (wpEL.childNodes.length === 1) {
    el = wpEL.childNodes[0];
  } else {
    el = Array.prototype.slice.call(wpEL.childNodes);
  }
  wpEL.innerHTML = '';
  return el;
}

export function getNodeText(node) {
  return textContent(node);
}

export function on(elSelector, eventName, selector, handler, useCapture) {
  const _useCapture = useCapture === undefined ? false : useCapture;
  const elements = document.querySelectorAll(elSelector);
  const addEventListener = function(element) {
    element.addEventListener(eventName, function(e) {
      for (let target = e.target; target && target !== this; target = target.parentNode) {
        // loop parent nodes from the target to the delegation node
        let match = false;
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
