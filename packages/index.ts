import { App } from 'vue';
import imageViewer from './imageViewer';
const ImageViewer = (_Vue: App, injectKey: string) => {
  _Vue.provide(injectKey || 'imageViewer', this);
  _Vue.config.globalProperties.$imageViewer = imageViewer;
};
export { imageViewer };
export default ImageViewer;
