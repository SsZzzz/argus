import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import tracker from '../utils/tracker';

function jsError() {
  // 监听全局未捕获的错误
  window.addEventListener(
    'error',
    (event) => {
      const lastEvent = getLastEvent(); // 获取到最后一个交互事件
      // 脚本加载错误
      if (event.target?.src || event.target?.href) {
        tracker.send({
          category: 'error',
          type: 'resourceError', // 资源加载错误
          filename: event.target.src || event.target.href, // 哪个文件报错了
          tagName: event.target.tagName,
          selector: getSelector(event.target), // 代表最后一个操作的元素
        });
      } else {
        tracker.send({
          category: 'error',
          type: 'jsError', // js执行错误
          message: event.message, // 报错信息
          filename: event.filename, // 哪个文件报错了
          position: `${event.lineno}:${event.colno}`, // 报错的行列位置
          stack: getLines(event.error.stack),
          selector: lastEvent ? getSelector(lastEvent.path) : '', // 代表最后一个操作的元素
        });
      }
    },
    true,
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const lastEvent = getLastEvent(); // 获取到最后一个交互事件
      const reason = event.reason;
      let message;
      let filename;
      let line = 0;
      let column = 0;
      let stack = '';
      if (typeof reason === 'string') {
        message = reason;
      } else if (typeof reason === 'object') {
        message = reason.message;
        if (reason.stack) {
          const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
          filename = matchResult[1];
          line = matchResult[2];
          column = matchResult[3];
        }
        stack = getLines(reason.stack);
      }
      tracker.send({
        category: 'error', // 小类型，这是一个错误
        type: 'promiseError', // js执行错误
        message, // 报错信息
        filename, // 哪个文件报错了
        position: `${line}:${column}`, // 报错的行列位置
        stack,
        selector: lastEvent ? getSelector(lastEvent.path) : '', // 代表最后一个操作的元素
      });
    },
    true,
  );
}

function getLines(stack) {
  return stack
    .split('\n')
    .slice(1)
    .map((item) => item.replace(/^\s+at\s+/g, ''))
    .join('^');
}

export default jsError;
