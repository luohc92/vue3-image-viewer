import { PropType } from "vue";
declare const _sfc_main: import("vue").DefineComponent<{
    curIndex: {
        type: NumberConstructor;
        default: number;
    };
    images: {
        type: PropType<string[]>;
        default: string[];
    };
    showDownload: {
        type: BooleanConstructor;
        default: boolean;
    };
    showThumbnail: {
        type: BooleanConstructor;
        default: boolean;
    };
    handlePosition: {
        type: StringConstructor;
        default: string;
    };
    onClose: {
        type: FunctionConstructor;
        default: FunctionConstructor;
    };
    onDownload: {
        type: FunctionConstructor;
        default: FunctionConstructor;
    };
    zIndex: {
        type: NumberConstructor;
        default: number;
    };
    maskBgColor: {
        type: StringConstructor;
        default: string;
    };
}, {
    close: () => void;
    handleTapClose: () => void;
    pre: () => void;
    next: () => void;
    thumbnailRef: import("vue").Ref<any>;
    imgStyle: import("vue").ComputedRef<{
        transform: string;
        transition: string;
        "margin-left": string;
        "margin-top": string;
        maxWidth: string;
        maxHeight: string;
    }>;
    handleMouseDown: (e: MouseEvent) => void;
    sequenceStyle: import("vue").ComputedRef<{
        top: string;
        bottom: string;
    }>;
    actionStyle: import("vue").ComputedRef<{
        bottom: string;
        top: string;
    }>;
    handleActions: (action: any, options?: {}) => void;
    download: () => void;
    toggleMode: () => void;
    change: (index: number) => void;
    mouseEnterThumbnail: (e: boolean) => void;
    mode: import("vue").Ref<{
        name: string;
        icon: string;
    }>;
    visible: import("vue").Ref<boolean>;
    curIndex: import("vue").Ref<number>;
    isMouseEnterThumbnail: import("vue").Ref<boolean>;
    thumbnailTransitionShow: import("vue").Ref<boolean>;
    transform: import("vue").Ref<{
        scale: number;
        deg: number;
        rotateY: number;
        offsetX: number;
        offsetY: number;
        enableTransition: boolean;
    }>;
    dragHandler: import("vue").Ref<() => void>;
    keyDownHandler: import("vue").Ref<(e: KeyboardEvent) => void>;
    mouseWheelHandler: import("vue").Ref<() => void>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    curIndex: {
        type: NumberConstructor;
        default: number;
    };
    images: {
        type: PropType<string[]>;
        default: string[];
    };
    showDownload: {
        type: BooleanConstructor;
        default: boolean;
    };
    showThumbnail: {
        type: BooleanConstructor;
        default: boolean;
    };
    handlePosition: {
        type: StringConstructor;
        default: string;
    };
    onClose: {
        type: FunctionConstructor;
        default: FunctionConstructor;
    };
    onDownload: {
        type: FunctionConstructor;
        default: FunctionConstructor;
    };
    zIndex: {
        type: NumberConstructor;
        default: number;
    };
    maskBgColor: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    curIndex: number;
    images: string[];
    showDownload: boolean;
    showThumbnail: boolean;
    handlePosition: string;
    onClose: Function;
    onDownload: Function;
    zIndex: number;
    maskBgColor: string;
}>;
export default _sfc_main;
