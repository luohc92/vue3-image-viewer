export declare const on: (element: Document, event: string, handler: any | (() => void)) => void;
export declare const off: (element: Document, event: string, handler: any | (() => void)) => void;
export declare const isFirefox: () => boolean;
export declare function rafThrottle(fn: any): (this: unknown, ...args: any) => void;
export declare function downImage(imgSrc: string): void;
