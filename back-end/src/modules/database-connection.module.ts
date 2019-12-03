import { Connection, createConnection, ConnectionOptions, Schema, Model } from 'mongoose';


export default class ConnectionModule {

    public db: Connection;

    constructor(uri: string, name: string, options?: ConnectionOptions) {
        this.db = createConnection(uri, options);

        this.db.on('open', () => console.log(`Success to connect database "${ name }"`));
        this.db.on('error', () => console.log(`Fail to connect database "${ name }"`));
    }

    public getModel(name: string, schema: Schema): Model<any> {
        return this.db.model(name, schema);
    }

}