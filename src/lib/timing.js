import tracker from '../utils/tracker';
import onload from '../utils/onload';

function timing() {
  let LCP; // Largest contentful paint
  // 增加一个性能条目的观察者
  new PerformanceObserver((entryList, observer) => {
    const perfEntries = entryList.getEntries();
    LCP = perfEntries[perfEntries.length - 1];
    observer.disconnect(); // 不再观察了
  }).observe({ entryTypes: ['largest-contentful-paint'] }); // 观察页面中最大的元素

  // 刚开始页面内容为空，等页面渲染完成，再去做判断
  onload(function () {
    setTimeout(() => {
      const {
        startTime,
        unloadEventStart,
        unloadEventEnd,
        redirectStart,
        redirectEnd,
        fetchStart,
        domainLookupStart,
        domainLookupEnd,
        connectStart,
        secureConnectionStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
        loadEventEnd,
      } = performance.getEntriesByType('navigation')[0];
      // 发送时间指标
      // tracker.send({
      //   type: 'stageTime', // 统计每个阶段的时间
      //   total: loadEventEnd - startTime,
      //   unload: unloadEventEnd - unloadEventStart, // 前一个页面卸载耗时,前一个页面卸载时可能监听了 unload 做些数据收集，会影响页面跳转
      //   redirect: redirectEnd - redirectStart, // 重定向耗时
      //   appCache: domainLookupStart - fetchStart, //缓存耗时
      //   dns: domainLookupEnd - domainLookupStart, // DNS 解析耗时
      //   tcp: connectEnd - connectStart, // TCP连接耗时
      //   ttfb: responseStart - requestStart, // 首字节到达时间
      //   response: responseEnd - responseStart, // 数据传输耗时
      //   dom1: domInteractive - responseEnd, // 可交互 DOM 解析耗时
      //   dom2: domContentLoadedEventStart - domInteractive, // 剩余 DOM 解析耗时
      //   domContentLoaded: domContentLoadedEventEnd - domContentLoadedEventStart, // DOMContentLoaded事件回调耗时
      //   resources: loadEventStart - domContentLoadedEventEnd, // 资源加载耗时
      //   load: loadEventEnd - loadEventStart, // onLoad事件耗时
      // });
      tracker.send({
        class: 'time',
        type: 'stageTime', // 统计每个阶段的时间
        startTime,
        unloadEventStart,
        unloadEventEnd,
        redirectStart,
        redirectEnd,
        fetchStart,
        domainLookupStart,
        domainLookupEnd,
        connectStart,
        secureConnectionStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
        loadEventEnd,
      });
      const resourceTime = performance.getEntriesByType('resource');
      tracker.send({
        class: 'time',
        type: 'resourceTime',
        resources: resourceTime.map(
          ({
            name,
            initiatorType,
            duration,
            transferSize,
            startTime,
            responseEnd,
          }) => ({
            name,
            initiatorType,
            duration,
            transferSize,
            startTime,
            responseEnd,
          }),
        ),
      });
      // 发送性能指标
      let FP = performance.getEntriesByName('first-paint')[0];
      let FCP = performance.getEntriesByName('first-contentful-paint')[0];
      tracker.send({
        class: 'time',
        type: 'paintTime',
        firstPaint: FP?.startTime,
        firstContentfulPaint: FCP?.startTime,
        largestContentfulPaint: LCP?.renderTime || LCP?.loadTime,
      });
    }, 5000);
    // 如果不放在settimeout里,loadEventEnd的值为0
  });
}

export default timing;
