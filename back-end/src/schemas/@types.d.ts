import { Document, Schema } from "mongoose";


export interface BlogUser extends Document {
    username: string;
    nickname: string;
    email: string;
    password: string;
    date?: {
        joinedAt: Date;
        lastLoginAt: Date;
    }
    level: number;
    profileImagePath?: string;
    profileImageFileName?: string;
    introduction?: string;
    verified: boolean;
}

export interface BlogArticle extends Document {
    title: string;
    date?: {
        createdAt: Date;
        lastUpdatedAt: Date;
    }
    category: string;
    content: string;
    author: Schema.Types.ObjectId;
    view: number;
    tags: Array<string>;
    comments: Array<Schema.Types.ObjectId>;
    status: boolean;
    images?: Array<string>;
    likes?: Array<Schema.Types.ObjectId>;
}

export interface BlogComment extends Document {
    article: Schema.Types.ObjectId;
    author?: Schema.Types.ObjectId;
    nickname?: string;
    link?: string;
    password?: string;
    content: string;
    date?: {
        createdAt: Date;
        lastUpdatedAt: Date;
    }
    parent?: Schema.Types.ObjectId;
    deleted?: boolean;
}


export interface PlayGroundItem extends Document {
    thumbnailImagePath?: string;
    title: {
        ko: string;
        en?: string;
    }
    uri: string;
    description?: string;
    author?: string;
    createdAt?: Date;
    status?: boolean;
}

export interface PlayGroundUser extends Document {
    username: string;
    password: string;
    authorized?: boolean;
}