# vue3-image-viewer

A image viewer for vue3.x

一款vue3.0的图片查看器

vue2.x版 [vue-image-viewer](https://github.com/luohc92/vue-image-viewer)

## Install 安装

```
npm install @luohc92/vue3-image-viewer
```

## Usage 使用方法

```
import ImageViewer from "@luohc92/vue3-image-viewer";
import '@luohc92/vue3-image-viewer/dist/style.css';
```

```
  ImageViewer({
    images: images,
    curIndex: 0,
    zIndex: 2000,
    showDownload: true,
    showThumbnail: true,
    handlePosition: "bottom",
    maskBgColor: "rgba(0,0,0,0.7)",
    onClose: () => {
      console.log("close");
    },
  });
```

### Props 属性

| Name           | Type                | Required | Description                                       | Default         |
| -------------- | ------------------- | -------- | ------------------------------------------------- | --------------- |
| images         | Array               | true     | images source 图片源                              | []              |
| curIndex       | Number              | false    | default display image 默认显示图片                | 0               |
| zIndex         | Number              | false    | set image viewer z-index 设置图片查看器的 z-index | 2000            |
| showDownload   | Boolean             | false    | show download button 显示下载按钮                 | false           |
| showThumbnail  | Boolean             | false    | show images thumbnail 显示图片缩略图              | false           |
| handlePosition | String [top,bottom] | false    | set handle position 设置操作柄显示位置            | bottom          |
| maskBgColor    | String              | false    | set mask background color 设置遮罩背景颜色        | rgba(0,0,0,0.7) |
| onClose        | Function            | false    | close function callback 关闭方法回调              | null            |
| onDownload     | Function            | false    | download image function callback 关闭方法回调     | null            |

### Keyboard Shortcuts 快捷键

| Keyboard    | Action                                                                          |
| ----------- | ------------------------------------------------------------------------------- |
| arrow-left  | prev 上一张                                                                     |
| arrow-right | next 下一张                                                                     |
| arrow-up    | zoomIn 放大                                                                     |
| arrow-down  | zoomOut 缩小                                                                    |
| alt         | clockwise rotation 顺时针旋转                                                   |
| ctrl        | mirror 镜像翻转                                                                 |
| space       | toggle image size mode [contain,original] 图片显示大小模式[自适应大小,原始大小] |
| esc         | close 关闭                                                                      |
