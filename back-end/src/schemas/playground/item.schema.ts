import { Schema } from "mongoose";


const schema: Schema = new Schema({
    thumbnailImagePath: String,
    title: {
        ko: { type: String, required: true },
        en: String
    },
    uri: { type: String, required: true },
    description: String,
    author: String,
    createdAt: { type: Date, required: true },
    status: { type: Boolean, default: true }
});

export default schema;