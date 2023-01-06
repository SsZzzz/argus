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
      ...data,
      documentTitle: document.title,
      locationHref: location.href,
      timestamp: Date.now(),
    });
    if (immediately || this.list.length >= 5) {
      clearTimeout(this.timer);
      this.timer = null;
      this.uploadLog();
    } else if (this.timer === null) {
      // 这里不能直接写this.uploadLog,不然uploadLog的this是Timeout
      this.timer = setTimeout(() => this.uploadLog(), 10000);
    }
  }

  uploadLog() {
    fetch('/argusUploadLog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        basic: getBasicData(),
        list: this.list,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.list = [];
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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