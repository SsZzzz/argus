import tracker from '../utils/tracker';

function network() {
  const { effectiveType, rtt, downlink } = navigator.connection;
  tracker.send({
    category: 'network',
    effectiveType, // 网络环境
    rtt, // 表示从发送端发送数据开始，到发送端收到来自接收端的确认（接收端收到数据后便立即发送确认，不包含数据传输时间）总共经历的时间,单位是ms
    downlink, // 表示有效带宽的估计值，单位是M/s
  });
}

export default network;
