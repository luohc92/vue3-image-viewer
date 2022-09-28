export interface ImageViewerOptionsDto {
    curIndex?: number;
    images: string[];
    showDownload?: boolean;
    showThumbnail?: boolean;
    handlePosition?: "top" | "bottom";
    onClose?: () => void;
    onDownload?: (url: string) => void;
    zIndex?: number;
    maskBgColor?: string;
}
