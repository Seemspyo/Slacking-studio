import { IconDefinition } from "@fortawesome/free-solid-svg-icons";


export interface SearchKeyword {
    value: string;
    selected: boolean;
}

export type visibilityState = 'show' | 'hide';
export type activationState = 'activate' | 'deactivate';

export interface OuterLink {
    uri: string;
    target?: string;
    title?: string;
    icon: IconDefinition;
}

export interface RenderableComment {
    id: string;
    authorId?: string;
    parentId: string;
    content: string;
    nickname: string;
    password?: string;
    profileImagePath: string;
    editMode: boolean;
    replyMode: boolean;
    dateString: string;
    type: 'user' | 'guest';
    deleted: boolean;
}