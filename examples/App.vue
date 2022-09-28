<script setup lang="ts">
import ImageViewer from "../packages";
const images = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
];
const handleTapImage = () => {
  ImageViewer({
    images: images,
  });
};
</script>
<template>
  <div @click="handleTapImage">viewer</div>
</template>
