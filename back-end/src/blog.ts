/** Core Modules */
import express from 'express';
import https from "https";
import cors from 'cors';

/** Routes */
import AuthRoute from './routes/blog/auth.route';
import UserRoute from './routes/blog/user.route';
import ArticleRoute from './routes/blog/article.route';
import CommentRoute from './routes/blog/comment.route';
import FallbackRoute from './routes/fallback.route';
import AnalyticsRoute from './routes/blog/analytics.route';

/** Privates */
import { PORT } from './privates/blog.private';
import { privateKey, publicKey, PASSPHRASE, getCert } from './privates/tls.private';

/** Custom Modules */
import { BlogRoute } from './routes/blog/blog.route';
import { AuthModule } from './modules/auth.module';
import { CipherModule } from './modules/cipher.module';
import { limit } from './modules/limit-origin.module';


process.title = 'eunsatio-blog';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50md' }));
app.use(cors({ origin: limit(['https://blog.eunsatio.io']) }));

const routes = [
    AuthRoute, UserRoute, ArticleRoute, CommentRoute, AnalyticsRoute, FallbackRoute
]

BlogRoute.setModules({
    authModule: new AuthModule(privateKey, publicKey, PASSPHRASE),
    cipherModule: new CipherModule(privateKey, publicKey, PASSPHRASE)
});

for (const Route of routes) new Route(app).route();

https.createServer(getCert('blog.eunsatio.io'), app)
.listen(PORT, () => console.log(`Blog Server running on port ${ PORT }`));