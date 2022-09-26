import { createVNode } from '@vue/runtime-core';
import { render } from '@vue/runtime-dom';
import imageViewerCpt from './imageViewer.vue';
interface ImageViewerOptionsDto {
  curIndex: number;
  images: string[];
  showDownload: boolean;
  showThumbnail: boolean;
  handlePosition: 'top' | 'bottom';
  onClose: () => void;
  onDownload: (url: string) => void;
  zIndex: number;
  maskBgColor: string;
}

const defaultOptions: ImageViewerOptionsDto = {
  curIndex: 0,
  images: [],
  showDownload: false,
  showThumbnail: false,
  handlePosition: 'bottom',
  onClose: Function,
  onDownload: Function,
  zIndex: 2000,
  maskBgColor: 'rgba(0,0,0,0.5)',
};
let container: HTMLDivElement | null;
const imageViewer = (options: ImageViewerOptionsDto) => {
  if (container) {
    document.body.removeChild(container);
  }
  container = document.createElement('div');
  container.className = 'tmd-image-viewer-container';
  const opts = {
    ...defaultOptions,
    ...options,
  };
  const vm = createVNode(imageViewerCpt, opts);
  if (vm.props) {
    vm.props.onDestroy = () => {
      setTimeout(() => {
        if (container) {
          render(null, container);
          container = null;
        }
      }, 300);
    };
  }
  render(vm, container);
  if (container.firstElementChild) {
    document.body.appendChild(container.firstElementChild);
  }
};
export default imageViewer;
