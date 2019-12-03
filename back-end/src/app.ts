/** Core Modules */
import express from "express";
import https from "https";
import vhost from 'vhost';

/** Privates */
import { credentials, privateKey, publicKey, PASSPHRASE } from "./privates/tls.private";

/** Routes */
import AppRoute from "./routes/app/app.route";
import RedirectRoute from "./routes/app/redirect.route";

/** Custom Modules */
import virtualHost from './modules/virtual-host.module';
import { AuthModule } from "./modules/auth.module";
import Prenreder from "./modules/prerender.module";


process.title = 'eunsatio-app';

const
PORT = 443,
DOMAIN = 'eunsatio.io',
authModule = new AuthModule(privateKey, publicKey, PASSPHRASE),
app = express();

const
gate = virtualHost('gate'),
blog = virtualHost('blog', { index: false }),
playground = virtualHost('playground', { index: 'app.html' });

new RedirectRoute(gate).route();
new AppRoute(gate, authModule, { assignToken: false }).route();
new AppRoute(blog, authModule).route();
new AppRoute(playground, authModule).route();

new Prenreder(app).enable();

app.use(vhost(`${ DOMAIN }`, gate));
app.use(vhost(`blog.${ DOMAIN }`, blog));
app.use(vhost(`playground.${ DOMAIN }`, playground));

https.createServer(credentials, app)
.listen(PORT, () => console.log(`HTTPS service running on port ${ PORT }`));