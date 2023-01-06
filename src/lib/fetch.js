import tracker from '../utils/tracker';

function fetch() {
  const originFetch = window.fetch;

  function hijackFetch(url, options) {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      originFetch.apply(this, [url, options]).then(
        async (response) => {
          const originResponseJson = response.json;
          response.json = function (...responseRest) {
            return new Promise((responseResolve, responseReject) => {
              originResponseJson.apply(this, responseRest).then(
                (result) => {
                  responseResolve(result);
                },
                (error) => {
                  if (url !== '/argusUploadLog') {
                    tracker.send({
                      class: 'fetch',
                      type: 'error',
                      url,
                      status: response.status, // 状态码
                      statusText: response.statusText,
                      duration: Date.now() - startTime,
                      response: error.stack ? JSON.stringify(error.stack) : '', // 响应体
                      method: options.method || 'get',
                      params: options.body, // 入参
                    });
                  }
                  responseReject(error);
                },
              );
            });
          };
          resolve(response);
        },
        (error) => {
          // 连接未连接上
          if (url !== '/argusUploadLog') {
            tracker.send({
              class: 'fetch',
              type: 'load',
              url,
              duration: Date.now() - startTime,
              response: error.stack ? JSON.stringify(error.stack) : '', // 响应体
              method: options.method || 'get',
              params: options.body, // 入参
            });
          }
          reject(error);
        },
      );
    });
  }

  window.fetch = hijackFetch;
}

export default fetch;
