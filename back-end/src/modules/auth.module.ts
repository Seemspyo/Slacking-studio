/** Core Modules */
import { sign, verify, JsonWebTokenError } from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';

/** Custom Modules */
import { ForbiddenError, AccessError } from './error.module';


export class AuthModule {

    private readonly APP_ACCESS_HEADER = 'ss-app-access-token';
    private readonly USER_ACCESS_HEADER = 'ss-user-access-token';

    public algorithm: string = 'RS256';

    constructor(
        private privateKey: Buffer,
        private publicKey: Buffer,
        private passphrase: string
    ) {}

    public sign(payload: any): string {
        const { privateKey, passphrase, algorithm } = this;

        return sign(payload, { key: privateKey, passphrase }, { algorithm });
    }

    public verify(token: string): any {
        return this.verifyToken(token);
    }

    public appTokenCheck(req: Request): any {
        const token = req.headers[this.APP_ACCESS_HEADER] as string;
        if (!token) throw new AccessError();

        const
        payload = this.verifyToken(token),
        [ ip, host ] = payload.secret.split('|');

        if (ip !== req.ip || host !== req.hostname) throw new ForbiddenError();

        return payload;
    }

    public userTokenCheck(headers: IncomingHttpHeaders): any {
        const token = headers[this.USER_ACCESS_HEADER] as string;
        if (!token) throw new AccessError();

        return this.verifyToken(token);
    }

    private verifyToken(token: string): any {
        try {
            return verify(token, this.publicKey, { algorithms: [ this.algorithm ] });
        } catch (error) {
            if (error instanceof JsonWebTokenError) throw new ForbiddenError();

            throw error;
        }
    }

}