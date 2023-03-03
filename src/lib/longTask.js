import tracker from '../utils/tracker';
import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';

function longTask() {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      // 不加这个条件会有很多的longTask
      if (entry.duration > 100) {
        const lastEvent = getLastEvent();
        requestIdleCallback(() => {
          tracker.send({
            category: 'longTask',
            eventType: lastEvent?.type,
            // startTime: entry.startTime, // 开始时间
            duration: entry.duration, // 持续时间
            selector: lastEvent
              ? getSelector(lastEvent?.path || lastEvent?.target)
              : '',
          });
        });
      }
    });
  });
  observer.observe({ entryTypes: ['longtask'] });
}

export default longTask;
