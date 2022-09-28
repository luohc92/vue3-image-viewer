export declare const ImageViewer: (options:  {
  curIndex: number;
  images: string[];
  showDownload: boolean;
  showThumbnail: boolean;
  handlePosition: "top" | "bottom";
  onClose: () => void;
  onDownload: (url: string) => void;
  zIndex: number;
  maskBgColor: string;
}) => void;
