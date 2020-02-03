/** Core Modules */
import express from 'express';
import https from "https";
import cors from 'cors';

/** Routes */
import AuthRoute from './routes/playground/auth.route';
import ItemRoute from './routes/playground/item.route';
import FallbackRoute from './routes/fallback.route';

/** Custom Modules */
import { AuthModule } from './modules/auth.module';
import { CipherModule } from './modules/cipher.module';
import { limit } from './modules/limit-origin.module';
import { ErrorHandler } from './modules/error.module';
import { privateKey, publicKey, PASSPHRASE, getCert } from './modules/tls.module';


process.title = 'eunsatio-playground';

const
PORT = process.env.PLAYGROUND_WAS_PORT,
app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50md' }));
app.use(cors({ origin: limit([`https://playground.${ process.env.DOMAIN }`]) }));

const
auth = new AuthModule(privateKey, publicKey, PASSPHRASE),
cipher = new CipherModule(privateKey, publicKey, PASSPHRASE),
errorHandler = new ErrorHandler();

new AuthRoute(app, { auth, cipher, error: errorHandler }).route();
new ItemRoute(app, { auth, error: errorHandler }).route();
new FallbackRoute(app).route();

https.createServer(getCert(`playground.${ process.env.DOMAIN }`), app)
.listen(PORT, () => console.log(`Playground Server running on port ${ PORT }`));