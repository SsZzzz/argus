import tracker from '../utils/tracker';

function pv() {
  let startTime = Date.now();
  let prevHref = location.href;
  const originPushState = history.pushState;
  const originReplaceState = history.replaceState;

  function trackerSend() {
    tracker.send({
      category: 'pv',
      endTime: Date.now,
      startTime,
      locationHref: prevHref,
    });
    startTime = Date.now;
    prevHref = location.href;
  }

  function hijackPushState() {
    originPushState.apply(this, arguments);
    trackerSend();
  }
  history.pushState = hijackPushState;

  function hijackReplaceState() {
    originReplaceState.apply(this, arguments);
    trackerSend();
  }
  history.ReplaceState = hijackReplaceState;

  window.addEventListener('popstate', () => {
    trackerSend();
  });

  window.addEventListener(
    'unload',
    () => {
      tracker.send(
        {
          category: 'pv',
          endTime: Date.now,
          startTime,
        },
        { immediately: true },
      );
    },
    false,
  );
}

export default pv;
