export interface PointerXY { x: number; y: number; }

export interface ThemeInfo {
    [key: string]: any;
    id: string;
    color: string;
    type?: 'background-theme' | 'key-theme';
}

export interface GalleryItem {
    _id?: string;
    thumbnailImagePath?: string;
    title: {
        ko: string;
        en: string;
    }
    uri: string;
    description?: string;
    author?: string;
    createdAt?: Date;
    status?: boolean;
}