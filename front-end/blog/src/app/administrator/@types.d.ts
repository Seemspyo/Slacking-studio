import { IconDefinition } from "@fortawesome/free-solid-svg-icons";


export interface NavigationButton {
    url: string;
    icon: IconDefinition;
    label: string;
}

export interface RenderableArticle {
    title: string;
    category: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    view: number;
    likes: number;
    comments: number;
    editLink: string;
}

export interface RenderableComment {
    id?: string;
    articleTitle: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    editLink: string;
}

export interface DashboardCard {
    id: string;
    icon: IconDefinition;
    data: any;
    label: string;
}