import tracker from '../utils/tracker';

function device() {
  tracker.send({
    class: 'device',
    screenWidth: window.screen.width, // 屏幕的分辨率
    screenHeight: window.screen.height, // 屏幕的分辨率
    innerWidth: window.innerWidth, // 浏览器视口的分辨率(不包含标签栏,地址栏)
    innerHeight: window.innerHeight, // 浏览器视口的分辨率(不包含标签栏,地址栏)
  });
}

export default device;
