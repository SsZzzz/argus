function getSelectors(path) {
  // path是dom节点组成的数组,此函数是将dom转换为带id和类名的字符串
  return path
    .reverse()
    .filter((element) => element !== document && element !== window)
    .map((element) => {
      const nodeName = element.nodeName.toLowerCase();
      if (element.id) {
        return `${nodeName}#${element.id}`;
      } else if (element.className && typeof element.className === 'string') {
        return `${nodeName}.${element.className}`;
      } else {
        return nodeName;
      }
    })
    .join(' ');
}

export default function (pathsOrTarget) {
  if (Array.isArray(pathsOrTarget)) {
    return getSelectors(pathsOrTarget);
  } else {
    let path = [];
    while (pathsOrTarget) {
      path.push(pathsOrTarget);
      pathsOrTarget = pathsOrTarget.parentNode;
    }
    return getSelectors(path);
  }
}
