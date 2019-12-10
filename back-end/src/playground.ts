/** Core Modules */
import express from 'express';
import https from "https";
import cors from 'cors';

/** Routes */
import AuthRoute from './routes/playground/auth.route';
import ItemRoute from './routes/playground/item.route';
import FallbackRoute from './routes/fallback.route';

/** Privates */
import { PORT } from './privates/playground.private';
import { privateKey, publicKey, PASSPHRASE, getCert } from './privates/tls.private';

/** Custom Modules */
import { AuthModule } from './modules/auth.module';
import { CipherModule } from './modules/cipher.module';
import { limit } from './modules/limit-origin.module';
import { ErrorHandler } from './modules/error.module';


process.title = 'eunsatio-playground';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50md' }));
app.use(cors({ origin: limit(['https://playground.eunsatio.io']) }));

const
auth = new AuthModule(privateKey, publicKey, PASSPHRASE),
cipher = new CipherModule(privateKey, publicKey, PASSPHRASE),
errorHandler = new ErrorHandler();

new AuthRoute(app, { auth, cipher, error: errorHandler }).route();
new ItemRoute(app, { auth, error: errorHandler }).route();
new FallbackRoute(app);

https.createServer(getCert('playground.eunsatio.io'), app)
.listen(PORT, () => console.log(`Blog Server running on port ${ PORT }`));