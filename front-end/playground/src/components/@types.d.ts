export interface PointerXY { x: number; y: number; }

export interface ThemeInfo {
    [key: string]: any;
    id: string;
    color: string;
    type?: 'background-color' | 'key-color';
}