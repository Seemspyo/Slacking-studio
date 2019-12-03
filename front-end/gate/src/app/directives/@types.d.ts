export interface SlideDirectiveOption {
    slideEl?: Element;
    initialIndex?: number;
    timing?: string;
    duration?: number;
    attachTo?: Array<any> | any;
    maxDistance?: number;
    minDistance?: number;
}