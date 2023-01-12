import tracker from '../utils/tracker';

function XHR() {
  const XMLHttpRequest = window.XMLHttpRequest;
  const originOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, async) {
    this.logData = { method, url, async };
    return originOpen.apply(this, arguments);
  };

  const originSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body) {
    const startTime = Date.now();
    const handler = (type) => (event) => {
      // 持续时间
      tracker.send({
        category: 'xhr',
        type,
        url: this.logData.url,
        status: this.status, // 状态码
        statusText: this.statusText, // 状态码
        duration: Date.now() - startTime,
        response: this.response, // 响应体
        method: this.logData.method,
        params: body, // 入参
      });
    };
    this.addEventListener('load', handler('load'), false);
    this.addEventListener('error', handler('error'), false);
    this.addEventListener('abort', handler('abort'), false);
    return originSend.apply(this, arguments);
  };
}

export default XHR;
