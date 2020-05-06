export interface ResultResponse {
    result: number;
    [key: string]: any;
}

export interface UserPayload {
    _id: string;
    nickname: string;
    email: string;
    level: number;
    profileImagePath?: string;
    verified: boolean;
}

export interface User {
    _id?: string;
    nickname?: string;
    email?: string;
    password?: string;
    date?: {
        joinedAt?: Date;
        lastLoginAt?: Date;
    }
    level?: number;
    profileImage?: File;
    profileImagePath?: string;
    profileImageFileName?: string;
    introduction?: string;
    verified?: boolean;
}

export interface UserPublic {
    nickname: string;
    profileImagePath?: string;
    profileImageFileName?: string;
    email: string;
    date?: {
        joinedAt?: Date;
        lastLoginAt?: Date;
    }
    introduction?: string;
}

export interface StickyBarOption {
    delay?: number;
    duration?: number;
    context?: any;
}

export interface StickyBarStack {
    id: string;
    el: HTMLElement;
    delay?: number;
    duration?: number;
    order?: number;
    step?: number;
}

export interface Article {
    _id?: string;
    title: string;
    date?: {
        createdAt: Date;
        lastUpdatedAt: Date;
    }
    category: string;
    content: string;
    author?: any;
    view?: number;
    comments?: Array<string>;
    status: boolean;
    images?: Array<string>;
    tags?: Array<string>;
    likes?: Array<string>;
}

export interface ArticleDisplayable extends Article {
    link: string;
    modifyLink: string;
    thumbnailImagePath: string;
    thumbnailImagePromise?: Promise<void>;
}

export interface ArticleSearchOption {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: boolean;
}

export interface ArticleComment {
    _id?: string;
    article?: any;
    author?: any;
    nickname?: string;
    password?: string;
    content?: string;
    date?: {
        createdAt: Date;
        lastUpdatedAt: Date;
    }
    parent?: string;
    deleted?: boolean;
}

export interface CountData {
    count: number;
}

export interface HeadProperties {
    meta?: BlogMeta;
    title?: string;
}

export interface BlogMeta {
    'og:title'?: string;
    'og:type'?: string;
    'og:description'?: string;
    'og:image'?: string;
}