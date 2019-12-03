import { IconDefinition } from "@fortawesome/free-solid-svg-icons";


export interface AccountComponentChild {
    readonly title: string;
}

export interface FormItem {
    id?: string;
    name?: string;
    title: string;
    type: string;
    controlKey: string;
    hasError?: () => boolean;
    errorMessage?: string | (() => string);
}

export interface MyAccountNavigationButton {
    id: string;
    title: string;
    icon: IconDefinition;
    active?: boolean;
}

export interface Bookmark {
    title: string;
    link: string;
    date: string;
    marked: boolean;
}

export interface UserComment {
    articleTitle: string;
    link: string;
    date: string;
    content: string;
}