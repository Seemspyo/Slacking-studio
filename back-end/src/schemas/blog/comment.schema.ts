import { Schema } from "mongoose";


const schema = new Schema({
    article: { type: Schema.Types.ObjectId, ref: 'article', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user' },
    nickname: String,
    password: String,
    content: { type: String, required: true, maxlength: 250 },
    date: {
        createdAt: { type: Date, required: true },
        lastUpdatedAt: { type: Date, required: true }
    },
    parent: { type: Schema.Types.ObjectId, ref: 'comment' },
    deleted: { type: Boolean, default: false }
});

export default schema;