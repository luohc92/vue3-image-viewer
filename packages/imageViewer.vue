<template>
  <transition name="viewer-fade">
    <div
      v-show="visible"
      tabindex="-1"
      class="tmd-image-viewer__wrapper"
      :style="`z-index:${zIndex}`"
    >
      <div
        class="tmd-image-viewer__mask"
        :style="`background-color:${maskBgColor};`"
        @click="handleTapClose"
      ></div>
      <span
        class="tmd-image-viewer__btn tmd-image-viewer__close"
        @click="close"
      >
        <i class="iconfont icon-close"></i>
      </span>
      <span
        v-if="images && images.length > 1"
        class="tmd-image-viewer__btn tmd-image-viewer__pre"
        @click="pre"
      >
        <i class="iconfont icon-arrow-left"></i>
      </span>
      <span
        v-if="images && images.length > 1"
        class="tmd-image-viewer__btn tmd-image-viewer__next"
        @click="next"
      >
        <i class="iconfont icon-arrow-right"></i>
      </span>
      <div class="tmd-image-viewer__image">
        <img
          :src="images[curIndex]"
          :style="imgStyle"
          @mousedown="handleMouseDown"
          v-show="images && images.length > 0 && images[curIndex]"
        />
      </div>
      <div class="tmd-image-viewer__actions" :style="actionStyle">
        <div class="tmd-image-viewer_actions__inner">
          <span
            class="iconfont icon-zoom-out"
            @click="handleActions('zoomOut')"
          ></span>
          <span
            class="iconfont icon-zoom-in"
            @click="handleActions('zoomIn')"
          ></span>
          <span class="tmd-image-viewer__actions__divider"></span>
          <span
            class="iconfont icon-refresh-left"
            @click="handleActions('anticlockwise')"
          ></span>
          <span
            class="iconfont icon-refresh-right"
            @click="handleActions('clockwise')"
          ></span>
          <span
            class="iconfont icon-mirror"
            @click="handleActions('mirror')"
          ></span>
          <span class="tmd-image-viewer__actions__divider"></span>
          <span class="iconfont" :class="mode.icon" @click="toggleMode"></span>
          <template v-if="showDownload">
            <span class="tmd-image-viewer__actions__divider"></span>
            <span class="iconfont icon-download" @click="download"></span>
          </template>
        </div>
      </div>
      <transition name="thumbnail-fade" @after-enter="change(curIndex)">
        <div
          class="tmd-image-viewer__thumbnail"
          ref="thumbnailRef"
          v-show="
            thumbnailTransitionShow &&
            showThumbnail &&
            images &&
            images.length > 1
          "
          @mouseenter="mouseEnterThumbnail(true)"
          @mouseleave="mouseEnterThumbnail(false)"
        >
          <div
            class="tmd-image-viewer__thumbnail__inner"
            :class="{ current: curIndex === index }"
            v-for="(image, index) in images"
            :key="image + '_thumbnail_' + index"
            @click="change(index)"
          >
            <img :src="image" />
          </div>
        </div>
      </transition>
      <span
        class="tmd-image-viewer__sequence"
        :style="sequenceStyle"
        v-show="!showThumbnail"
      >
        {{ curIndex + 1 }} / {{ images.length }}
      </span>
    </div>
  </transition>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  reactive,
  ref,
  toRefs,
} from "vue";
import { downImage, isFirefox, off, on, rafThrottle } from "./util";
import "./assets/iconfont.css";
export default defineComponent({
  name: "ImageViewer",
  props: {
    curIndex: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array as PropType<string[]>,
      default: [] as string[],
    },
    showDownload: {
      type: Boolean,
      default: false,
    },
    showThumbnail: {
      type: Boolean,
      default: false,
    },
    handlePosition: {
      type: String,
      default: "bottom",
    },
    onClose: {
      type: Function,
      default: Function,
    },
    onDownload: {
      type: Function,
      default: Function,
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
    maskBgColor: {
      type: String,
      default: "rgba(0,0,0,0.5)",
    },
  },
  setup(props) {
    const Mode = {
      CONTAIN: {
        name: "contain",
        icon: "icon-full-screen",
      },
      ORIGINAL: {
        name: "original",
        icon: "icon-c-scale-to-original",
      },
    };
    const mousewheelEventName = isFirefox() ? "DOMMouseScroll" : "mousewheel";
    const state = reactive({
      mode: Mode.CONTAIN,
      visible: false,
      curIndex: 0,
      isMouseEnterThumbnail: false,
      thumbnailTransitionShow: false,
      transform: {
        scale: 1,
        deg: 0,
        rotateY: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      },
      dragHandler: () => {},
      keyDownHandler: (e: KeyboardEvent) => {},
      mouseWheelHandler: () => {},
    });
    const thumbnailRef = ref();
    const sequenceStyle = computed(() => {
      if (props.handlePosition == "bottom") {
        return {
          top: "10px",
          bottom: "auto",
        };
      }
      return {
        bottom: "10px",
        top: "auto",
      };
    });
    const actionStyle = computed(() => {
      if (props.handlePosition == "bottom") {
        return {
          bottom:
            props.showThumbnail && props.images && props.images.length > 1
              ? "100px"
              : "30px",
          top: "auto",
        };
      }
      return {
        top: "30px",
        bottom: "auto",
      };
    });
    const imgStyle = computed(() => {
      const { scale, deg, rotateY, offsetX, offsetY, enableTransition } =
        state.transform;
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg) rotateY(${rotateY}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`,
        maxWidth: "",
        maxHeight: "",
      };
      if (state.mode.name === Mode.CONTAIN.name) {
        style.maxWidth = style.maxHeight = "100%";
      }
      return style;
    });
    const isFirst = computed(() => state.curIndex === 0);
    const isLast = computed(() => state.curIndex === props.images.length - 1);
    const mouseEnterThumbnail = (e: boolean) => {
      state.isMouseEnterThumbnail = e;
    };
    const change = (index: number) => {
      if (!props.showThumbnail) {
        return;
      }
      state.curIndex = index;
      let vmEl = thumbnailRef.value;
      if (!vmEl) return;
      let width = vmEl.clientWidth;
      let scrollLeft = vmEl.scrollLeft;
      let cur = vmEl.children[index].offsetLeft;
      if (width - cur < 160) {
        if (width - cur < 0 && scrollLeft === 0) {
          vmEl.scrollLeft = cur - width + 160;
        } else {
          vmEl.scrollLeft = scrollLeft + 80;
        }
      } else if (cur - scrollLeft < 80) {
        vmEl.scrollLeft = cur - 120;
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const { offsetX, offsetY } = state.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      state.dragHandler = rafThrottle((ev: MouseEvent) => {
        state.transform.offsetX = offsetX + ev.pageX - startX;
        state.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, "mousemove", state.dragHandler);
      on(document, "mouseup", () => {
        off(document, "mousemove", state.dragHandler);
      });
      e.preventDefault();
    };
    const pre = () => {
      if (isFirst.value) return;
      const len = props.images.length;
      state.curIndex = (state.curIndex - 1 + len) % len;
      change(state.curIndex);
    };
    const next = () => {
      if (isLast.value) return;
      const len = props.images.length;
      state.curIndex = (state.curIndex + 1) % len;
      change(state.curIndex);
    };
    const deviceSupportInstall = () => {
      state.keyDownHandler = (e: KeyboardEvent) => {
        e.preventDefault();
        const keyCode = e.keyCode;
        switch (keyCode) {
          case 17:
            handleActions("mirror");
            break;
          case 18:
            handleActions("clockwise");
            break;
          // ESC
          case 27:
            close();
            break;
          // SPACE
          case 32:
            toggleMode();
            break;
          // LEFT_ARROW
          case 37:
            pre();
            break;
          // UP_ARROW
          case 38:
            handleActions("zoomIn");
            break;
          // RIGHT_ARROW
          case 39:
            next();
            break;
          // DOWN_ARROW
          case 40:
            handleActions("zoomOut");
            break;
        }
      };
      state.mouseWheelHandler = rafThrottle((e: any) => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (state.isMouseEnterThumbnail) {
          let moveForwardStep = -1;
          let moveBackStep = 1;
          let step = 0;
          step = delta > 0 ? moveForwardStep * 50 : moveBackStep * 50;
          if (thumbnailRef.value) {
            thumbnailRef.value.scrollLeft =
              thumbnailRef.value.scrollLeft + step;
          }
        } else {
          if (delta > 0) {
            handleActions("zoomIn", {
              zoomRate: 0.015,
              enableTransition: false,
            });
          } else {
            handleActions("zoomOut", {
              zoomRate: 0.015,
              enableTransition: false,
            });
          }
        }
      });
      on(document, "keydown", state.keyDownHandler);
      on(document, mousewheelEventName, state.mouseWheelHandler);
    };
    const deviceSupportUninstall = () => {
      off(document, "keydown", state.keyDownHandler);
      off(document, mousewheelEventName, state.mouseWheelHandler);
      state.keyDownHandler = (e: KeyboardEvent) => {};
      state.mouseWheelHandler = () => {};
    };
    const handleActions = (action: any, options = {}) => {
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options,
      };
      const { transform } = state;
      switch (action) {
        case "zoomOut":
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            );
          }
          break;
        case "zoomIn":
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case "clockwise":
          transform.deg += rotateDeg;
          break;
        case "anticlockwise":
          transform.deg -= rotateDeg;
          break;
        case "mirror":
          transform.rotateY += 180;
          break;
      }
      transform.enableTransition = enableTransition;
    };
    const reset = () => {
      state.transform = {
        scale: 1,
        deg: 0,
        rotateY: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      };
    };
    const toggleMode = () => {
      const modeNames = Object.keys(Mode);
      const modeValues = Object.values(Mode);
      const index = modeValues.findIndex((e) => e.name == state.mode.name);
      const nextIndex = (index + 1) % modeNames.length;
      state.mode = modeValues[nextIndex];
      reset();
    };
    const download = () => {
      downImage(props.images[state.curIndex]);
      props.onDownload?.(props.images[state.curIndex]);
    };
    const handleTapClose = () => {
      close();
    };
    const close = () => {
      props.onClose?.();
      deviceSupportUninstall();
      state.visible = false;
      state.thumbnailTransitionShow = false;
    };
    onMounted(() => {
      state.curIndex = props.curIndex;
      deviceSupportInstall();
      state.visible = true;
      nextTick(() => {
        state.thumbnailTransitionShow = true;
      });
    });
    return {
      ...toRefs(state),
      close,
      handleTapClose,
      pre,
      next,
      thumbnailRef,
      imgStyle,
      handleMouseDown,
      sequenceStyle,
      actionStyle,
      handleActions,
      download,
      toggleMode,
      change,
      mouseEnterThumbnail,
    };
  },
});
</script>
<style>
.tmd-image-viewer__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.tmd-image-viewer__mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}

.tmd-image-viewer__image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.tmd-image-viewer__image:active {
  cursor: move;
}

.viewer-fade-enter-active {
  animation: viewer-fade-in 0.3s;
}

.viewer-fade-leave-active {
  animation: viewer-fade-out 0.3s;
}

@keyframes viewer-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }

  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes viewer-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }

  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}

.thumbnail-fade-enter-active {
  animation: thumbnail-fade-in 0.5s;
}

.thumbnail-fade-leave-active {
  animation: thumbnail-fade-out 0.5s;
}

@keyframes thumbnail-fade-in {
  0% {
    transform: translateX(-50%) translateY(80px);
    opacity: 0;
  }

  100% {
    transform: translateX(-50%) translateY(0px);
    opacity: 1;
  }
}

@keyframes thumbnail-fade-out {
  0% {
    transform: translateX(-50%) translateY(0px);
    opacity: 1;
  }

  100% {
    transform: translateX(-50%) translateY(80px);
    opacity: 0;
  }
}

.tmd-image-viewer__sequence {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  user-select: none;
  color: #ffffff;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
}

.tmd-image-viewer__actions {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
  left: 50%;
  top: 30px;
  transform: translateX(-50%);
  height: 44px;
  padding: 0 23px;
  background-color: #222222;
  opacity: 0.8;
  border-color: #fff;
  border-radius: 8px;
}

.tmd-image-viewer_actions__inner {
  width: 100%;
  height: 100%;
  text-align: justify;
  cursor: default;
  font-size: 23px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.tmd-image-viewer_actions__inner span {
  margin-left: 6px;
  margin-right: 6px;
  cursor: pointer;
}

.tmd-image-viewer__wrapper .iconfont {
  font-size: 23px;
}

.tmd-image-viewer__btn {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.8;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
}

.tmd-image-viewer__close {
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  font-size: 24px;
  color: #fff;
  background-color: #606266;
}

.tmd-image-viewer__next,
.tmd-image-viewer__pre {
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  font-size: 24px;
  color: #fff;
  background-color: #606266;
  border-color: #fff;
}

.tmd-image-viewer__pre {
  left: 40px;
}

.tmd-image-viewer__next {
  right: 40px;
  text-indent: 2px;
}

.tmd-image-viewer__thumbnail {
  position: absolute;
  z-index: 1;
  bottom: 10px;
  display: flex;
  flex-wrap: nowrap;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  left: 50%;
  transform: translateX(-50%);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 6px;
  box-sizing: border-box;
  background-color: #222222;
  max-width: 80%;
  border-radius: 8px;
}

.tmd-image-viewer__thumbnail__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  min-width: 60px;
  max-width: 100px;
  margin: 0px 2px;
  background-color: rgb(49, 49, 49);
  border: 2px solid transparent;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.tmd-image-viewer__thumbnail__inner.current {
  border: 2px solid #ffffff;
}

.tmd-image-viewer__thumbnail img {
  max-height: 100%;
  max-width: 100%;
}

.tmd-image-viewer__thumbnail::-webkit-scrollbar {
  width: 8px;
  height: 5px;
  background-color: transparent;
}

.tmd-image-viewer__thumbnail::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: transparent;
}

.tmd-image-viewer__thumbnail::-webkit-scrollbar-thumb {
  border-radius: 5px;
  border: 3px solid rgba(2, 2, 2, 0.8);
  border-top-width: 1px;
  background-color: rgba(255, 255, 255, 0.4);
}

.tmd-image-viewer__thumbnail::-webkit-scrollbar-thumb:hover {
  border: 1px solid rgba(2, 2, 2, 0.8);
}

.tmd-image-viewer__thumbnail::-webkit-scrollbar-button {
  background-color: transparent;
  width: 2px;
}
</style>
