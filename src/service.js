// 分词服务 返回词语数据
import { flatten, param } from './util';
import api_key from './api_key';

const isProd = process.env.NODE_ENV === 'production';

const service_host = 'http://api.ltp-cloud.com/analysis/';

const TIMEOUT = 1000 * 3;

const head = document.getElementsByTagName('head')[0];
function callApi(url, params, cb) {
  if (isProd) {
    xhr(url, params, cb);
    return;
  }

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
    window.ltpCloudCallback = a => null;
    script.onload = null;
    script.onerror = null;
    head.removeChild(script);
    cb(new Error('timeout'));
  }, TIMEOUT);
  script.setAttribute('src', `${url}?${urlParam}`);
  head.appendChild(script);
}

function xhr(url, params, cb) {
  const urlParam = param(params);
  GM_xmlhttpRequest({
    method: 'GET',
    url: `${url}?${urlParam}`,
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
    ontimeout: () => cb(new Error('timeout')),
  });
}

export function wordSegment(text, cb) {
  callApi(service_host, {
    api_key,
    text,
    pattern: 'ws',
    format: 'json',
  }, (err, paragraphs) =>
    err ? cb(err) : cb(null, flatten(paragraphs).map(word => word.cont))
  )
}
