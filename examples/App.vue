<template>
  <div>
    <button @click="handleTapImage">handleTapImage</button>
  </div>
</template>

<script lang="ts" setup>
import { imageViewer } from '~/index';
const images = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
];
const handleTapImage = () => {
  imageViewer({
    images: images,
    curIndex: 0,
    zIndex: 3000,
    showDownload: true,
    showThumbnail: true,
    handlePosition: 'bottom',
    maskBgColor: 'rgba(0,0,0,0.7)',
    onClose: () => {
      console.log('close');
    },
    onDownload: (url: string) => {
      console.log(url);
    },
  });
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
