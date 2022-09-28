import { defineComponent as G, reactive as J, ref as K, computed as v, onMounted as Q, nextTick as Z, toRefs as ee, openBlock as w, createBlock as ne, Transition as A, withCtx as F, withDirectives as y, createElementVNode as i, normalizeStyle as b, createElementBlock as k, createCommentVNode as z, vShow as I, normalizeClass as L, Fragment as O, createVNode as R, renderList as oe, toDisplayString as Y, render as _ } from "vue";
const $ = typeof window > "u", C = function() {
  return $ ? function(e, n, a) {
    e && n && a && e.attachEvent("on" + n, a);
  } : function(e, n, a) {
    e && n && a && e.addEventListener(n, a, !1);
  };
}(), S = function() {
  return $ ? function(e, n, a) {
    e && n && e.detachEvent("on" + n, a);
  } : function(e, n, a) {
    e && n && e.removeEventListener(n, a, !1);
  };
}(), te = function() {
  return !$ && !!window.navigator.userAgent.match(/firefox/i);
};
function B(e) {
  let n = !1;
  return function(...a) {
    n || (n = !0, window.requestAnimationFrame((o) => {
      e.apply(this, a), n = !1;
    }));
  };
}
function se(e) {
  const n = new Image();
  n.setAttribute("crossOrigin", "anonymous"), n.onload = function() {
    const a = document.createElement("canvas");
    a.width = n.width, a.height = n.height;
    const o = a.getContext("2d");
    o == null || o.drawImage(n, 0, 0, n.width, n.height);
    const c = a.toDataURL("image/png"), h = document.createElement("a"), s = new MouseEvent("click"), f = e.split("/"), p = f[f.length - 1];
    h.download = p || "img", h.href = c, h.dispatchEvent(s);
  }, n.src = e;
}
const ae = G({
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
    }, a = te() ? "DOMMouseScroll" : "mousewheel", o = J({
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
    }), c = K(), h = v(() => e.handlePosition == "bottom" ? {
      top: "10px",
      bottom: "auto"
    } : {
      bottom: "10px",
      top: "auto"
    }), s = v(() => e.handlePosition == "bottom" ? {
      bottom: e.showThumbnail && e.images && e.images.length > 1 ? "100px" : "30px",
      top: "auto"
    } : {
      top: "30px",
      bottom: "auto"
    }), f = v(() => {
      const { scale: t, deg: l, rotateY: u, offsetX: d, offsetY: r, enableTransition: m } = o.transform, E = {
        transform: `scale(${t}) rotate(${l}deg) rotateY(${u}deg)`,
        transition: m ? "transform .3s" : "",
        "margin-left": `${d}px`,
        "margin-top": `${r}px`,
        maxWidth: "",
        maxHeight: ""
      };
      return o.mode.name === n.CONTAIN.name && (E.maxWidth = E.maxHeight = "100%"), E;
    }), p = v(() => o.curIndex === 0), V = v(() => o.curIndex === e.images.length - 1), W = (t) => {
      o.isMouseEnterThumbnail = t;
    }, T = (t) => {
      if (!e.showThumbnail)
        return;
      o.curIndex = t;
      let l = c.value;
      if (!l)
        return;
      let u = l.clientWidth, d = l.scrollLeft, r = l.children[t].offsetLeft;
      u - r < 160 ? u - r < 0 && d === 0 ? l.scrollLeft = r - u + 160 : l.scrollLeft = d + 80 : r - d < 80 && (l.scrollLeft = r - 120);
    }, X = (t) => {
      if (t.button !== 0)
        return;
      const { offsetX: l, offsetY: u } = o.transform, d = t.pageX, r = t.pageY;
      o.dragHandler = B((m) => {
        o.transform.offsetX = l + m.pageX - d, o.transform.offsetY = u + m.pageY - r;
      }), C(document, "mousemove", o.dragHandler), C(document, "mouseup", () => {
        S(document, "mousemove", o.dragHandler);
      }), t.preventDefault();
    }, M = () => {
      if (p.value)
        return;
      const t = e.images.length;
      o.curIndex = (o.curIndex - 1 + t) % t, T(o.curIndex);
    }, H = () => {
      if (V.value)
        return;
      const t = e.images.length;
      o.curIndex = (o.curIndex + 1) % t, T(o.curIndex);
    }, q = () => {
      o.keyDownHandler = (t) => {
        switch (t.preventDefault(), t.keyCode) {
          case 17:
            g("mirror");
            break;
          case 18:
            g("clockwise");
            break;
          case 27:
            D();
            break;
          case 32:
            N();
            break;
          case 37:
            M();
            break;
          case 38:
            g("zoomIn");
            break;
          case 39:
            H();
            break;
          case 40:
            g("zoomOut");
            break;
        }
      }, o.mouseWheelHandler = B((t) => {
        const l = t.wheelDelta ? t.wheelDelta : -t.detail;
        if (o.isMouseEnterThumbnail) {
          let u = -1, d = 1, r = 0;
          r = l > 0 ? u * 50 : d * 50, c.value && (c.value.scrollLeft = c.value.scrollLeft + r);
        } else
          l > 0 ? g("zoomIn", {
            zoomRate: 0.015,
            enableTransition: !1
          }) : g("zoomOut", {
            zoomRate: 0.015,
            enableTransition: !1
          });
      }), C(document, "keydown", o.keyDownHandler), C(document, a, o.mouseWheelHandler);
    }, P = () => {
      S(document, "keydown", o.keyDownHandler), S(document, a, o.mouseWheelHandler), o.keyDownHandler = (t) => {
      }, o.mouseWheelHandler = () => {
      };
    }, g = (t, l = {}) => {
      const { zoomRate: u, rotateDeg: d, enableTransition: r } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: !0,
        ...l
      }, { transform: m } = o;
      switch (t) {
        case "zoomOut":
          m.scale > 0.2 && (m.scale = parseFloat(
            (m.scale - u).toFixed(3)
          ));
          break;
        case "zoomIn":
          m.scale = parseFloat((m.scale + u).toFixed(3));
          break;
        case "clockwise":
          m.deg += d;
          break;
        case "anticlockwise":
          m.deg -= d;
          break;
        case "mirror":
          m.rotateY += 180;
          break;
      }
      m.enableTransition = r;
    }, j = () => {
      o.transform = {
        scale: 1,
        deg: 0,
        rotateY: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: !1
      };
    }, N = () => {
      const t = Object.keys(n), l = Object.values(n), d = (l.findIndex((r) => r.name == o.mode.name) + 1) % t.length;
      o.mode = l[d], j();
    }, x = () => {
      var t;
      se(e.images[o.curIndex]), (t = e.onDownload) == null || t.call(e, e.images[o.curIndex]);
    }, U = () => {
      D();
    }, D = () => {
      var t;
      (t = e.onClose) == null || t.call(e), P(), o.visible = !1, o.thumbnailTransitionShow = !1;
    };
    return Q(() => {
      o.curIndex = e.curIndex, q(), o.visible = !0, Z(() => {
        o.thumbnailTransitionShow = !0;
      });
    }), {
      ...ee(o),
      close: D,
      handleTapClose: U,
      pre: M,
      next: H,
      thumbnailRef: c,
      imgStyle: f,
      handleMouseDown: X,
      sequenceStyle: h,
      actionStyle: s,
      handleActions: g,
      download: x,
      toggleMode: N,
      change: T,
      mouseEnterThumbnail: W
    };
  }
});
const ie = (e, n) => {
  const a = e.__vccOpts || e;
  for (const [o, c] of n)
    a[o] = c;
  return a;
}, le = /* @__PURE__ */ i("i", { class: "iconfont icon-close" }, null, -1), re = [
  le
], de = /* @__PURE__ */ i("i", { class: "iconfont icon-arrow-left" }, null, -1), me = [
  de
], ue = /* @__PURE__ */ i("i", { class: "iconfont icon-arrow-right" }, null, -1), ce = [
  ue
], fe = { class: "tmd-image-viewer__image" }, ge = ["src"], he = { class: "tmd-image-viewer_actions__inner" }, we = /* @__PURE__ */ i("span", { class: "tmd-image-viewer__actions__divider" }, null, -1), ve = /* @__PURE__ */ i("span", { class: "tmd-image-viewer__actions__divider" }, null, -1), be = /* @__PURE__ */ i("span", { class: "tmd-image-viewer__actions__divider" }, null, -1), ke = ["onClick"], pe = ["src"];
function ye(e, n, a, o, c, h) {
  return w(), ne(A, { name: "viewer-fade" }, {
    default: F(() => [
      y(i("div", {
        tabindex: "-1",
        class: "tmd-image-viewer__wrapper",
        style: b(`z-index:${e.zIndex}`)
      }, [
        i("div", {
          class: "tmd-image-viewer__mask",
          style: b(`background-color:${e.maskBgColor};`),
          onClick: n[0] || (n[0] = (...s) => e.handleTapClose && e.handleTapClose(...s))
        }, null, 4),
        i("span", {
          class: "tmd-image-viewer__btn tmd-image-viewer__close",
          onClick: n[1] || (n[1] = (...s) => e.close && e.close(...s))
        }, re),
        e.images && e.images.length > 1 ? (w(), k("span", {
          key: 0,
          class: "tmd-image-viewer__btn tmd-image-viewer__pre",
          onClick: n[2] || (n[2] = (...s) => e.pre && e.pre(...s))
        }, me)) : z("", !0),
        e.images && e.images.length > 1 ? (w(), k("span", {
          key: 1,
          class: "tmd-image-viewer__btn tmd-image-viewer__next",
          onClick: n[3] || (n[3] = (...s) => e.next && e.next(...s))
        }, ce)) : z("", !0),
        i("div", fe, [
          y(i("img", {
            src: e.images[e.curIndex],
            style: b(e.imgStyle),
            onMousedown: n[4] || (n[4] = (...s) => e.handleMouseDown && e.handleMouseDown(...s))
          }, null, 44, ge), [
            [I, e.images && e.images.length > 0 && e.images[e.curIndex]]
          ])
        ]),
        i("div", {
          class: "tmd-image-viewer__actions",
          style: b(e.actionStyle)
        }, [
          i("div", he, [
            i("span", {
              class: "iconfont icon-zoom-out",
              onClick: n[5] || (n[5] = (s) => e.handleActions("zoomOut"))
            }),
            i("span", {
              class: "iconfont icon-zoom-in",
              onClick: n[6] || (n[6] = (s) => e.handleActions("zoomIn"))
            }),
            we,
            i("span", {
              class: "iconfont icon-refresh-left",
              onClick: n[7] || (n[7] = (s) => e.handleActions("anticlockwise"))
            }),
            i("span", {
              class: "iconfont icon-refresh-right",
              onClick: n[8] || (n[8] = (s) => e.handleActions("clockwise"))
            }),
            i("span", {
              class: "iconfont icon-mirror",
              onClick: n[9] || (n[9] = (s) => e.handleActions("mirror"))
            }),
            ve,
            i("span", {
              class: L(["iconfont", e.mode.icon]),
              onClick: n[10] || (n[10] = (...s) => e.toggleMode && e.toggleMode(...s))
            }, null, 2),
            e.showDownload ? (w(), k(O, { key: 0 }, [
              be,
              i("span", {
                class: "iconfont icon-download",
                onClick: n[11] || (n[11] = (...s) => e.download && e.download(...s))
              })
            ], 64)) : z("", !0)
          ])
        ], 4),
        R(A, {
          name: "thumbnail-fade",
          onAfterEnter: n[14] || (n[14] = (s) => e.change(e.curIndex))
        }, {
          default: F(() => [
            y(i("div", {
              class: "tmd-image-viewer__thumbnail",
              ref: "thumbnailRef",
              onMouseenter: n[12] || (n[12] = (s) => e.mouseEnterThumbnail(!0)),
              onMouseleave: n[13] || (n[13] = (s) => e.mouseEnterThumbnail(!1))
            }, [
              (w(!0), k(O, null, oe(e.images, (s, f) => (w(), k("div", {
                class: L(["tmd-image-viewer__thumbnail__inner", { current: e.curIndex === f }]),
                key: s + "_thumbnail_" + f,
                onClick: (p) => e.change(f)
              }, [
                i("img", { src: s }, null, 8, pe)
              ], 10, ke))), 128))
            ], 544), [
              [
                I,
                e.thumbnailTransitionShow && e.showThumbnail && e.images && e.images.length > 1
              ]
            ])
          ]),
          _: 1
        }),
        y(i("span", {
          class: "tmd-image-viewer__sequence",
          style: b(e.sequenceStyle)
        }, Y(e.curIndex + 1) + " / " + Y(e.images.length), 5), [
          [I, !e.showThumbnail]
        ])
      ], 4), [
        [I, e.visible]
      ])
    ]),
    _: 1
  });
}
const Ie = /* @__PURE__ */ ie(ae, [["render", ye]]), Ce = {
  curIndex: 0,
  images: [],
  showDownload: !1,
  showThumbnail: !1,
  handlePosition: "bottom",
  onClose: Function,
  onDownload: Function,
  zIndex: 2e3,
  maskBgColor: "rgba(0,0,0,0.5)"
}, De = (e) => {
  const n = document.createElement("div");
  n.className = "tmd-image-viewer-container";
  const a = {
    ...Ce,
    ...e,
    onClose: e.onClose || null,
    onDownload: e.onDownload || null
  }, o = R(Ie, a);
  o && o.props && (o.props.onDestroy = () => {
    setTimeout(() => {
      _(null, n);
    }, 300);
  }), _(o, n), n.firstElementChild && document.body.appendChild(n.firstElementChild);
};
export {
  De as default
};
