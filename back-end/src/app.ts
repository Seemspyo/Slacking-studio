/** Core Modules */
import express from "express";
import https from "https";
import vhost from 'vhost';

/** Routes */
import AppRoute from "./routes/app/app.route";
import RedirectRoute from "./routes/app/redirect.route";

/** Custom Modules */
import virtualHost from './modules/virtual-host.module';
import { AuthModule } from "./modules/auth.module";
import prerender from "./modules/prerender.module";
import { credentials, privateKey, publicKey, PASSPHRASE } from "./modules/tls.module";


process.title = 'eunsatio-app';

const
PORT = process.env.HTTPS_PORT,
DOMAIN = process.env.DOMAIN,
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

app.use(prerender);
app.use(vhost(`${ DOMAIN }`, gate));
app.use(vhost(`blog.${ DOMAIN }`, blog));
app.use(vhost(`playground.${ DOMAIN }`, playground));

https.createServer(credentials, app)
.listen(PORT, () => console.log(`HTTPS service running on port ${ PORT }`));