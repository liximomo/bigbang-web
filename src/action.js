import { param } from './util';

const WINDOW_NAME = 'bbSearchWindow';

export function baiduSearch(text) {
  const urlParam = param({
    wd: text
  });

  window.open(`https://www.baidu.com/s?${urlParam}`, WINDOW_NAME);
}

export function googleSearch(text) {
  const urlParam = param({
    q: text
  });
  window.open(`https://www.google.com.hk/search?${urlParam}`, WINDOW_NAME);
}
