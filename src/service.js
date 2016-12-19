// 分词服务 返回词语数据
import { flatten, param } from './util';
import api_key from './api_key';

const service_host = 'http://api.ltp-cloud.com/analysis/';

const TIMEOUT = 1000 * 3;

const head = document.getElementsByTagName('head')[0];
function jsonp(url, params, cb) {
  let err = null;
  let timeout = null;
  
  const urlParam = param({
    ...params,
    callback: 'ltpCloudCallback',
  });
  window.ltpCloudCallback = data => cb(null, data);
  const script = document.createElement('script');
  const callbackWrapper = (cb) => () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    head.removeChild(script);
    cb && cb();
  }
  script.onload = callbackWrapper();
  script.onerror = callbackWrapper(() => cb(new Error('fail')));
  timeout = setTimeout(() => {
    script.onload = null;
    script.onerror = null;
    head.removeChild(script);
    cb(new Error('timeout'));
  }, TIMEOUT);
  script.setAttribute('src', `${url}?${urlParam}`);
  head.appendChild(script);
}

export function wordSegment(text, cb) {
  jsonp(service_host, {
    api_key,
    text,
    pattern: 'ws',
    format: 'json',
  }, (err, paragraphs) =>
    err ? cb(err) : cb(null, flatten(paragraphs).map(word => word.cont))
  )
}
