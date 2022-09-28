import imageViewerCpt from "./imageVIewer.vue";
import { createVNode, render } from "vue";
import { ImageViewerOptionsDto } from "./types";
const defaultOptions: ImageViewerOptionsDto = {
  curIndex: 0,
  images: [],
  showDownload: false,
  showThumbnail: false,
  handlePosition: "bottom",
  onClose: Function,
  onDownload: Function,
  zIndex: 2000,
  maskBgColor: "rgba(0,0,0,0.5)",
};
const imageViewer = (options: ImageViewerOptionsDto) => {
  const container = document.createElement("div");
  container.className = "tmd-image-viewer-container";
  const opts = {
    ...defaultOptions,
    ...options,
    onClose: options.onClose || null,
    onDownload: options.onDownload || null,
  };
  const vm = createVNode(imageViewerCpt, opts);
  if (vm && vm.props) {
    vm.props.onDestroy = () => {
      setTimeout(() => {
        render(null, container);
      }, 300);
    };
  }
  render(vm, container);
  if (container.firstElementChild) {
    document.body.appendChild(container.firstElementChild);
  }
};
export default imageViewer;
