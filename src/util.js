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

export function copyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
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

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error(err);
  }

  document.body.removeChild(textArea);
  return success;
}
