const isServer = typeof window === 'undefined';
export const on = (function () {
  if (!isServer) {
    return function (element: Document, event: string, handler: any | (() => void)) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element: any, event: string, handler: any | (() => void)) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

export const off = (function () {
  if (!isServer) {
    return function (element: Document, event: string, handler: any | (() => void)) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element: any, event: string, handler: any | (() => void)) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();
export const isFirefox = function () {
  return !isServer && !!window.navigator.userAgent.match(/firefox/i);
};

export function rafThrottle(fn: any) {
  let locked = false;
  return function (this: unknown, ...args: any) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame((_) => {
      fn.apply(this, args);
      locked = false;
    });
  };
}

export function downImage(imgSrc: string) {
  const image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context?.drawImage(image, 0, 0, image.width, image.height);
    const url = canvas.toDataURL('image/png'); //得到图片的base64编码数据

    const a = document.createElement('a'); // 生成一个a元素
    const event = new MouseEvent('click'); // 创建一个单击事件
    const file = imgSrc.split('/');
    const imgName = file[file.length - 1];
    a.download = imgName || 'img'; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgSrc;
}
