/** Custom Modules */
import HttpModule from './http.module';
import CacheModule from './cache.module';
import jwtdecode from 'jwt-decode';

/** Variables */
import { WAS_HOST } from './@variables';


export default class AuthModule extends HttpModule {

    private cache = new CacheModule('__ss_playground_user_token', 'session');

    public username: string;
    public static sign: boolean = false;

    constructor() {
        super(WAS_HOST.concat('/auth'));
    }

    public initialAuth(): void {
        HttpModule.setHeader('ss-app-access-token', this.retrieveAppToken());

        const userToken = this.cache.get();
        if (userToken) this.deserializeUserToken(userToken);

        this.initialAuth = () => void(0);
    }

    public async signIn(username: string, password: string): Promise<void> {
        const { token } = await this.post<{ token: string }>('/sign-in', { username, password });

        this.deserializeUserToken(token);
    }

    public signOut(): void {
        this.cache.clear();
        HttpModule.deleteHeader('ss-user-access-token');
        AuthModule.sign = false;
    }

    private retrieveAppToken(): string {
        const doc = document;
        if (!(doc instanceof Document)) throw new TypeError('document is not defined.');

        const tokenEl = doc.head.querySelector('meta[name=app-token]');
        if (!tokenEl) throw new Error();

        doc.head.removeChild(tokenEl);

        return tokenEl.getAttribute('content');
    }

    private deserializeUserToken(token: string): void {
        const payload = jwtdecode(token);
        if (!payload.authorized) throw new Error();

        HttpModule.setHeader('ss-user-access-token', token);
        this.cache.set(token);
        AuthModule.sign = true;
    }

}