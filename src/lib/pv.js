import tracker from '../utils/tracker';

function pv() {
  const startTime = Date.now();
  window.addEventListener(
    'unload',
    () => {
      const stayTime = Date.now() - startTime;
      tracker.send(
        {
          category: 'pv',
          stayTime,
        },
        { immediately: true },
      );
    },
    false,
  );
}

export default pv;
