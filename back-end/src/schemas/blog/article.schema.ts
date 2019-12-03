import { Schema } from "mongoose";


const schema = new Schema({
    title: { type: String, required: true, unique: true },
    date: {
        createdAt: { type: Date, required: true },
        lastUpdatedAt: { type: Date, required: true }
    },
    category: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user' },
    view: { type: Number, required: true },
    tags: [ String ],
    comments: [
        { type: Schema.Types.ObjectId, ref: 'comment' }
    ],
    status: { type: Boolean, default: true },
    images: [ String ],
    likes: [
        { type: Schema.Types.ObjectId, ref: 'user', unique: true }
    ]
});

export default schema;