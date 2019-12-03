export interface GateNavigationParam {
    id: string;
    path: string;
    uri: string;
    title: string;
    description?: string;
    active?: boolean;
}

export interface ToggleNavOption {
    toggleSlide?: boolean;
}

export interface FontStyles {
    weight?: number;
    size?: number;
    family?: string;
}