let userAgent = require('user-agent');

class Tracker {
  constructor() {
    this.timer = null;
    this.list = [];
  }

  // 当list大于等于5或者immediately为true时,立即发送,否则10秒发送一次.
  // options:
  // immediately 是否立即发送
  send(data, options = {}) {
    const { immediately } = options;
    this.list.push({
      documentTitle: document.title,
      locationHref: location.href,
      createTime: Date.now(),
      ...data,
    });
    if (immediately || this.list.length >= 5) {
      clearTimeout(this.timer);
      this.timer = null;
      this.uploadLog();
    } else if (this.timer === null) {
      // 这里不能直接写this.uploadLog,不然uploadLog的this是Timeout
      this.timer = setTimeout(() => {
        this.uploadLog();
        this.timer = null;
      }, 10000);
    }
  }

  uploadLog() {
    fetch('/argus/uploadLog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      keepalive: true,
      body: JSON.stringify({
        basic: getBasicData(),
        list: this.list,
      }),
    }).catch((err) => {
      console.log(err);
    });
    this.list = [];
  }
}

function getBasicData() {
  const { userId, userName } =
    JSON.parse(localStorage.getItem('userInfo')) || {};

  return {
    userId,
    userName,
    userAgent: userAgent.parse(navigator.userAgent),
  };
}

export default new Tracker();
