/** Custom Modules */
import ConnectionModule from '../modules/database-connection.module';

/** Privates */
import { PLAYGROUND_DB_USERNAME, PLAYGROUND_DB_PASSWORD, PLAYGROUND_DB_PORT } from '../privates/playground.private';

/** Schemas */
import itemSchema from '../schemas/playground/item.schema';
import userSchema from '../schemas/playground/user.schema';

/** Types */
import { Model } from 'mongoose';
import { PlayGroundItem, PlayGroundUser } from '../schemas/@types';


const
commonOptions = { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true },
playgroundDB = new ConnectionModule(`mongodb://${ PLAYGROUND_DB_USERNAME }:${ PLAYGROUND_DB_PASSWORD }@localhost:${ PLAYGROUND_DB_PORT }/playground`, 'Playground util', commonOptions);

export const
Item: Model<PlayGroundItem> = playgroundDB.getModel('item', itemSchema),
User: Model<PlayGroundUser> = playgroundDB.getModel('user', userSchema);