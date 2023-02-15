import tracker from '../utils/tracker';

function pv() {
  const startTime = Date.now();
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
