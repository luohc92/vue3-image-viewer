import { defineComponent as G, reactive as J, ref as K, computed as b, onMounted as Q, nextTick as Z, toRefs as ee, openBlock as v, createBlock as ne, Transition as A, withCtx as F, withDirectives as C, createElementVNode as i, normalizeStyle as k, createElementBlock as y, createCommentVNode as z, vShow as T, normalizeClass as L, Fragment as O, createVNode as B, renderList as oe, toDisplayString as R, render as Y } from "vue";
const $ = typeof window > "u", p = function() {
  return $ ? function(e, n, s) {
    e && n && s && e.attachEvent("on" + n, s);
  } : function(e, n, s) {
    e && n && s && e.addEventListener(n, s, !1);
  };
}(), E = function() {
  return $ ? function(e, n, s) {
    e && n && e.detachEvent("on" + n, s);
  } : function(e, n, s) {
    e && n && e.removeEventListener(n, s, !1);
  };
}(), te = function() {
  return !$ && !!window.navigator.userAgent.match(/firefox/i);
};
function _(e) {
  let n = !1;
  return function(...s) {
    n || (n = !0, window.requestAnimationFrame((o) => {
      e.apply(this, s), n = !1;
    }));
  };
}
function ae(e) {
  const n = new Image();
  n.setAttribute("crossOrigin", "anonymous"), n.onload = function() {
    const s = document.createElement("canvas");
    s.width = n.width, s.height = n.height;
    const o = s.getContext("2d");
    o == null || o.drawImage(n, 0, 0, n.width, n.height);
    const u = s.toDataURL("image/png"), h = document.createElement("a"), a = new MouseEvent("click"), g = e.split("/"), I = g[g.length - 1];
    h.download = I || "img", h.href = u, h.dispatchEvent(a);
  }, n.src = e;
}
const se = G({
  name: "ImageViewer",
  props: {
    curIndex: {
      type: Number,
      default: 0
    },
    images: {
      type: Array,
      default: []
    },
    showDownload: {
      type: Boolean,
      default: !1
    },
    showThumbnail: {
      type: Boolean,
      default: !1
    },
    handlePosition: {
      type: String,
      default: "bottom"
    },
    onClose: {
      type: Function,
      default: Function
    },
    onDownload: {
      type: Function,
      default: Function
    },
    zIndex: {
      type: Number,
      default: 2e3
    },
    maskBgColor: {
      type: String,
      default: "rgba(0,0,0,0.5)"
    },
    zoomRate: {
      type: Number,
      default: 0.2
    },
    minScale: {
      type: Number,
      default: 0.2
    },
    maxScale: {
      type: Number,
      default: 3
    }
  },
  setup(e) {
    const n = {
      CONTAIN: {
        name: "contain",
        icon: "icon-full-screen"
      },
      ORIGINAL: {
        name: "original",
        icon: "icon-c-scale-to-original"
      }
    }, s = te() ? "DOMMouseScroll" : "mousewheel", o = J({
      mode: n.CONTAIN,
      visible: !1,
      curIndex: 0,
      isMouseEnterThumbnail: !1,
      thumbnailTransitionShow: !1,
      transform: {
        scale: 1,
        deg: 0,
        rotateY: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: !1
      },
      dragHandler: () => {
      },
      keyDownHandler: (t) => {
      },
      mouseWheelHandler: () => {
      }
    }), u = K(), h = b(() => e.handlePosition == "bottom" ? {
      top: "10px",
      bottom: "auto"
    } : {
      bottom: "10px",
      top: "auto"
    }), a = b(() => e.handlePosition == "bottom" ? {
      bottom: e.showThumbnail && e.images && e.images.length > 1 ? "100px" : "30px",
      top: "auto"
    } : {
      top: "30px",
      bottom: "auto"
    }), g = b(() => {
      const { scale: t, deg: l, rotateY: c, offsetX: m, offsetY: r, enableTransition: d } = o.transform, f = {
        transform: `scale(${t}) rotate(${l}deg) rotateY(${c}deg)`,
        transition: d ? "transform .3s" : "",
        "margin-left": `${m}px`,
        "margin-top": `${r}px`,
        maxWidth: "",
        maxHeight: ""
      };
      return o.mode.name === n.CONTAIN.name && (f.maxWidth = f.maxHeight = "100%"), f;
    }), I = b(() => o.curIndex === 0), V = b(() => o.curIndex === e.images.length - 1), W = (t) => {
      o.isMouseEnterThumbnail = t;
    }, S = (t) => {
      if (!e.showThumbnail)
        return;
      o.curIndex = t;
      let l = u.value;
      if (!l)
        return;
      let c = l.clientWidth, m = l.scrollLeft, r = l.children[t].offsetLeft;
      c - r < 160 ? c - r < 0 && m === 0 ? l.scrollLeft = r - c + 160 : l.scrollLeft = m + 80 : r - m < 80 && (l.scrollLeft = r - 120);
    }, X = (t) => {
      if (t.button !== 0)
        return;
      const { offsetX: l, offsetY: c } = o.transform, m = t.pageX, r = t.pageY;
      o.dragHandler = _((d) => {
        o.transform.offsetX = l + d.pageX - m, o.transform.offsetY = c + d.pageY - r;
      }), p(document, "mousemove", o.dragHandler), p(document, "mouseup", () => {
        E(document, "mousemove", o.dragHandler);
      }), t.preventDefault();
    }, N = () => {
      if (I.value)
        return;
      const t = e.images.length;
      o.curIndex = (o.curIndex - 1 + t) % t, S(o.curIndex);
    }, M = () => {
      if (V.value)
        return;
      const t = e.images.length;
      o.curIndex = (o.curIndex + 1) % t, S(o.curIndex);
    }, x = () => {
      o.keyDownHandler = (t) => {
        switch (t.preventDefault(), t.keyCode) {
          case 17:
            w("mirror");
            break;
          case 18:
            w("clockwise");
            break;
          case 27:
            D();
            break;
          case 32:
            H();
            break;
          case 37:
            N();
            break;
          case 38:
            w("zoomIn");
            break;
          case 39:
            M();
            break;
          case 40:
            w("zoomOut");
            break;
        }
      }, o.mouseWheelHandler = _((t) => {
        const l = t.wheelDelta ? t.wheelDelta : -t.detail;
        if (o.isMouseEnterThumbnail) {
          let c = -1, m = 1, r = 0;
          r = l > 0 ? c * 50 : m * 50, u.value && (u.value.scrollLeft = u.value.scrollLeft + r);
        } else
          l > 0 ? w("zoomIn", {
            zoomRate: e.zoomRate,
            enableTransition: !1
          }) : w("zoomOut", {
            zoomRate: e.zoomRate,
            enableTransition: !1
          });
      }), p(document, "keydown", o.keyDownHandler), p(document, s, o.mouseWheelHandler);
    }, q = () => {
      E(document, "keydown", o.keyDownHandler), E(document, s, o.mouseWheelHandler), o.keyDownHandler = (t) => {
      }, o.mouseWheelHandler = () => {
      };
    }, w = (t, l = {}) => {
      const { zoomRate: c, rotateDeg: m, enableTransition: r } = {
        zoomRate: e.zoomRate,
        rotateDeg: 90,
        enableTransition: !0,
        ...l
      }, { transform: d } = o;
      switch (t) {
        case "zoomOut":
          if (d.scale > e.minScale) {
            const f = parseFloat((d.scale / c).toFixed(3));
            d.scale = f < e.minScale ? e.minScale : f;
          }
          break;
        case "zoomIn":
          if (d.scale < e.maxScale) {
            const f = parseFloat((d.scale * c).toFixed(3));
            d.scale = f > e.maxScale ? e.maxScale : f;
          }
          break;
        case "clockwise":
          d.deg += m;
          break;
        case "anticlockwise":
          d.deg -= m;
          break;
        case "mirror":
          d.rotateY += 180;
          break;
      }
      d.enableTransition = r;
    }, P = () => {
      o.transform = {
        scale: 1,
        deg: 0,
        rotateY: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: !1
      };
    }, H = () => {
      const t = Object.keys(n), l = Object.values(n), m = (l.findIndex((r) => r.name == o.mode.name) + 1) % t.length;
      o.mode = l[m], P();
    }, j = () => {
      var t;
      ae(e.images[o.curIndex]), (t = e.onDownload) == null || t.call(e, e.images[o.curIndex]);
    }, U = () => {
      D();
    }, D = () => {
      var t;
      document.body.style.overflow = "", (t = e.onClose) == null || t.call(e), q(), o.visible = !1, o.thumbnailTransitionShow = !1;
    };
    return Q(() => {
      document.body.style.overflow = "hidden", o.curIndex = e.curIndex, x(), o.visible = !0, Z(() => {
        o.thumbnailTransitionShow = !0;
      });
    }), {
      ...ee(o),
      close: D,
      handleTapClose: U,
      pre: N,
      next: M,
      thumbnailRef: u,
      imgStyle: g,
      handleMouseDown: X,
      sequenceStyle: h,
      actionStyle: a,
      handleActions: w,
      download: j,
      toggleMode: H,
      change: S,
      mouseEnterThumbnail: W
    };
  }
});
const ie = (e, n) => {
  const s = e.__vccOpts || e;
  for (const [o, u] of n)
    s[o] = u;
  return s;
}, le = /* @__PURE__ */ i("i", { class: "iconfont icon-close" }, null, -1), re = [
  le
], de = /* @__PURE__ */ i("i", { class: "iconfont icon-arrow-left" }, null, -1), me = [
  de
], ce = /* @__PURE__ */ i("i", { class: "iconfont icon-arrow-right" }, null, -1), ue = [
  ce
], fe = { class: "tmd-image-viewer__image" }, ge = ["src"], we = { class: "tmd-image-viewer_actions__inner" }, he = /* @__PURE__ */ i("span", { class: "tmd-image-viewer__actions__divider" }, null, -1), ve = /* @__PURE__ */ i("span", { class: "tmd-image-viewer__actions__divider" }, null, -1), be = /* @__PURE__ */ i("span", { class: "tmd-image-viewer__actions__divider" }, null, -1), ke = ["onClick"], ye = ["src"];
function Ie(e, n, s, o, u, h) {
  return v(), ne(A, { name: "viewer-fade" }, {
    default: F(() => [
      C(i("div", {
        tabindex: "-1",
        class: "tmd-image-viewer__wrapper",
        style: k(`z-index:${e.zIndex}`)
      }, [
        i("div", {
          class: "tmd-image-viewer__mask",
          style: k(`background-color:${e.maskBgColor};`),
          onClick: n[0] || (n[0] = (...a) => e.handleTapClose && e.handleTapClose(...a))
        }, null, 4),
        i("span", {
          class: "tmd-image-viewer__btn tmd-image-viewer__close",
          onClick: n[1] || (n[1] = (...a) => e.close && e.close(...a))
        }, re),
        e.images && e.images.length > 1 ? (v(), y("span", {
          key: 0,
          class: "tmd-image-viewer__btn tmd-image-viewer__pre",
          onClick: n[2] || (n[2] = (...a) => e.pre && e.pre(...a))
        }, me)) : z("", !0),
        e.images && e.images.length > 1 ? (v(), y("span", {
          key: 1,
          class: "tmd-image-viewer__btn tmd-image-viewer__next",
          onClick: n[3] || (n[3] = (...a) => e.next && e.next(...a))
        }, ue)) : z("", !0),
        i("div", fe, [
          C(i("img", {
            src: e.images[e.curIndex],
            style: k(e.imgStyle),
            onMousedown: n[4] || (n[4] = (...a) => e.handleMouseDown && e.handleMouseDown(...a))
          }, null, 44, ge), [
            [T, e.images && e.images.length > 0 && e.images[e.curIndex]]
          ])
        ]),
        i("div", {
          class: "tmd-image-viewer__actions",
          style: k(e.actionStyle)
        }, [
          i("div", we, [
            i("span", {
              class: "iconfont icon-zoom-out",
              onClick: n[5] || (n[5] = (a) => e.handleActions("zoomOut"))
            }),
            i("span", {
              class: "iconfont icon-zoom-in",
              onClick: n[6] || (n[6] = (a) => e.handleActions("zoomIn"))
            }),
            he,
            i("span", {
              class: "iconfont icon-refresh-left",
              onClick: n[7] || (n[7] = (a) => e.handleActions("anticlockwise"))
            }),
            i("span", {
              class: "iconfont icon-refresh-right",
              onClick: n[8] || (n[8] = (a) => e.handleActions("clockwise"))
            }),
            i("span", {
              class: "iconfont icon-mirror",
              onClick: n[9] || (n[9] = (a) => e.handleActions("mirror"))
            }),
            ve,
            i("span", {
              class: L(["iconfont", e.mode.icon]),
              onClick: n[10] || (n[10] = (...a) => e.toggleMode && e.toggleMode(...a))
            }, null, 2),
            e.showDownload ? (v(), y(O, { key: 0 }, [
              be,
              i("span", {
                class: "iconfont icon-download",
                onClick: n[11] || (n[11] = (...a) => e.download && e.download(...a))
              })
            ], 64)) : z("", !0)
          ])
        ], 4),
        B(A, {
          name: "thumbnail-fade",
          onAfterEnter: n[14] || (n[14] = (a) => e.change(e.curIndex))
        }, {
          default: F(() => [
            C(i("div", {
              class: "tmd-image-viewer__thumbnail",
              ref: "thumbnailRef",
              onMouseenter: n[12] || (n[12] = (a) => e.mouseEnterThumbnail(!0)),
              onMouseleave: n[13] || (n[13] = (a) => e.mouseEnterThumbnail(!1))
            }, [
              (v(!0), y(O, null, oe(e.images, (a, g) => (v(), y("div", {
                class: L(["tmd-image-viewer__thumbnail__inner", { current: e.curIndex === g }]),
                key: a + "_thumbnail_" + g,
                onClick: (I) => e.change(g)
              }, [
                i("img", { src: a }, null, 8, ye)
              ], 10, ke))), 128))
            ], 544), [
              [T, e.thumbnailTransitionShow && e.showThumbnail && e.images && e.images.length > 1]
            ])
          ]),
          _: 1
        }),
        C(i("span", {
          class: "tmd-image-viewer__sequence",
          style: k(e.sequenceStyle)
        }, R(e.curIndex + 1) + " / " + R(e.images.length), 5), [
          [T, !e.showThumbnail]
        ])
      ], 4), [
        [T, e.visible]
      ])
    ]),
    _: 1
  });
}
const Ce = /* @__PURE__ */ ie(se, [["render", Ie]]), Te = {
  curIndex: 0,
  images: [],
  showDownload: !1,
  showThumbnail: !1,
  handlePosition: "bottom",
  onClose: Function,
  onDownload: Function,
  zIndex: 2e3,
  maskBgColor: "rgba(0,0,0,0.5)",
  zoomRate: 1.2,
  minScale: 0.2,
  maxScale: 5
}, Se = (e) => {
  const n = document.createElement("div");
  n.className = "tmd-image-viewer-container";
  const s = {
    ...Te,
    ...e,
    onClose: e.onClose || null,
    onDownload: e.onDownload || null
  }, o = B(Ce, s);
  o && o.props && (o.props.onDestroy = () => {
    setTimeout(() => {
      Y(null, n);
    }, 300);
  }), Y(o, n), n.firstElementChild && document.body.appendChild(n.firstElementChild);
};
export {
  Se as default
};
