<template>
  <el-form label-width="280px" :inline="false" style="margin-top: 50px">
    <el-form-item label="showDownload（显示下载按钮）">
      <el-checkbox v-model="showDownload" />
    </el-form-item>
    <el-form-item label="showThumbnail（显示缩略图）">
      <el-checkbox v-model="showThumbnail" />
    </el-form-item>
    <el-form-item label="handlePosition（操作柄位置）">
      <el-radio v-model="handlePosition" label="bottom">bottom 底部</el-radio>
      <el-radio v-model="handlePosition" label="top">top 顶部</el-radio>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleTapImage">
        Click Me 点击
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import ImageViewer from "@luohc92/vue3-image-viewer";
import "@luohc92/vue3-image-viewer/dist/style.css";
import { ElMessage } from "element-plus";
import { ref } from "vue";
const showDownload = ref(false);
const showThumbnail = ref(false);
const handlePosition = ref<"bottom" | "top">("bottom");
const maskBgColor = ref("rgba(0,0,0,0.7)");
const images = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
];
const handleTapImage = async () => {
  ImageViewer({
    images: images,
    showThumbnail: showThumbnail.value,
    showDownload: showDownload.value,
    handlePosition: handlePosition.value,
    onClose: () => {
      ElMessage.info("close");
    },
    onDownload: (url: string) => {
      ElMessage.info("down " + url);
    },
    maskBgColor: maskBgColor.value,
  });
};
</script>
