import { Schema } from "mongoose";


const schema: Schema = new Schema({
    nickname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: {
        joinedAt: { type: Date, required: true },
        lastLoginAt: Date
    },
    level: { type: Number, default: 0 },
    profileImagePath: String,
    profileImageFileName: String,
    introduction: String,
    verified: { type: Boolean, required: true }
});

export default schema;