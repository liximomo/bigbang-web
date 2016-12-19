import { flatten, param } from './util';

const service_host = 'http://api.ltp-cloud.com/analysis/';
const api_key = 'h9s2c4R62DjucGFfLpdfiyuK0pPMyoicLw3PAOhC';

const head = document.getElementsByTagName('head')[0];
function jsonp(url, params, cb) {
  const urlParam = param({
    ...params,
    callback: 'ltpCloudCallback',
  });
  window.ltpCloudCallback = data => cb(data);
  const script = document.createElement('script');
  script.setAttribute('src', `${url}?${urlParam}`);
  script.onload = () => head.removeChild(script);
  head.appendChild(script);
}

export function wordSegment(text, cb) {
  jsonp(service_host, {
    api_key,
    text,
    pattern: 'ws',
    format: 'json',
  }, paragraphs =>
    cb(flatten(paragraphs).map(word => word.cont))
  );
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
