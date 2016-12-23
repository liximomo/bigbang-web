// 分词服务 返回词语数据
import { flatten, param } from './util';
import api_key from './api_key';

const isProd = process.env.NODE_ENV === 'production';

const service_host = 'https://wordsegment-153208.appspot.com/ws';

const TIMEOUT = 1000 * 6;

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
    text,
  }, (err, words) =>
    err ? cb(err) : cb(null, words)
  )
}
