/** Custom Modules */
import Route from "../route";
import { AuthModule } from "../../modules/auth.module";
import { CipherModule } from "../../modules/cipher.module";
import { ErrorHandler, NotFoundError, AccessError } from "../../modules/error.module";

/** Types */
import { Application, Request, Response } from "express";

/** Models */
import { User } from "../../connections/playground.connection";


export default class AuthRoute extends Route {

    private auth: AuthModule;
    private cipher: CipherModule;
    private error: ErrorHandler;

    constructor(app: Application, handlers: { auth: AuthModule, cipher: CipherModule, error: ErrorHandler }) {
        super(app);
        Object.assign(this, handlers);

        this.routes = [
            { method: 'post', path: '/auth/sign-up', handler: this.signUp.bind(this) },
            { method: 'post', path: '/auth/sign-in', handler: this.signIn.bind(this) }
        ]
    }

    private async signUp(req: Request, res: Response): Promise<void> {
        try {
            this.auth.appTokenCheck(req);

            const { username, password } = req.body;

            const user = new User({
                username,
                password: this.cipher.publicEncrypt(password),
                authorized: false
            });

            await user.save();

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.error.handle(error, res);
        }
    }

    private async signIn(req: Request, res: Response): Promise<void> {
        try {
            this.auth.appTokenCheck(req);

            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) throw new NotFoundError();

            if (this.cipher.privateDecrypt(user.password) !== password) throw new AccessError();

            const token = this.auth.sign({ username })

            res.status(200).json({ token });
        } catch (error) {
            this.error.handle(error, res);
        }
    }

}