import { Schema } from "mongoose";


const schema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    authorized: Boolean
});

export default schema;