/** Core Module */
import multer from 'multer';

/** Custom Modules */
import { BlogRoute } from "./blog.route";
import { AccessError, NotFoundError } from "../../modules/error.module";
import { UploadModule } from "../../modules/upload.module";
import { MailModule, getVerifyMailTemplate } from "../../modules/mail.module";

/** Models */
import { User } from "../../connections/blog.connection";

/** Types */
import { Application, Request, Response } from "express";
import { BlogUser } from "../../schemas/@types";
import { MulterFile } from "../../modules/@types";


export default class AuthRoute extends BlogRoute {

    constructor(app: Application) {
        super(app);

        this.routes = [
            { method: 'post', path: '/auth/sign-in', handler: this.signIn.bind(this) },
            { method: 'post', path: '/auth/refresh-user-token', handler: this.refreshUserToken.bind(this) },
            { method: 'post', path: '/auth/sign-up', handler: this.signUp.bind(this) },
            { method: 'post', path: '/auth/validate-token', handler: this.verifyToken.bind(this) },
            { method: 'post', path: '/auth/user-verify', handler: this.verifyUserEmail.bind(this) },
            { method: 'post', path: '/auth/send-verify-mail', handler: this.sendVerifyMail.bind(this) }
        ]
    }

    private async signIn(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        try {
            this.auth.appTokenCheck(req);

            const user = await User.findOne({ email });
            if (!user) throw new NotFoundError();

            if (this.cipher.privateDecrypt(user.password) !== password) throw new AccessError();

            user.date.lastLoginAt = new Date();
            await user.save();

            const token = this.auth.sign(user.toObject({ transform: (user, clone) => this.userPayloadTransform(clone) }));

            res.status(200).json({ token });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async refreshUserToken(req: Request, res: Response): Promise<void> {
        const { token } = req.body;

        try {
            this.auth.appTokenCheck(req);

            if (!token) throw new AccessError();
            const userToken = this.auth.verify(token);

            const user = await User.findOne({ email: userToken.email });
            if (!user) throw new NotFoundError();

            const freshToken = this.auth.sign(user.toObject({ transform: (user, clone) => this.userPayloadTransform(clone) }));

            res.status(200).json({ token: freshToken });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async signUp(req: Request, res: Response): Promise<void> {
        const uploader = new UploadModule('/user/profile/images', 'profileImage', '../host/blog/data', 'profile-img');
        let profileImage: MulterFile;

        try {
            this.auth.appTokenCheck(req);

            profileImage = (await uploader.upload(req)) as MulterFile;

            const
            password = this.cipher.publicEncrypt(req.body.password),
            { username, nickname, email, introduction, profileImageFileName } = req.body,
            profileImagePath = profileImage && uploader.toRelativePath(profileImage.path);

            const user = new User({
                username,
                nickname,
                email,
                password,
                date: {
                    joinedAt: new Date()
                },
                level: 1,
                profileImagePath,
                profileImageFileName,
                introduction,
                verified: false
            });

            await user.save();

            res.status(200).json({ result: 1 });
        } catch (error) {
            if (!(error instanceof (multer as any).MulterError) && profileImage) uploader.removeFile(uploader.toAbsolutePath(profileImage.path));

            this.errorHandler.handle(error, res);
        }
    }

    private async verifyToken(req: Request, res: Response): Promise<void> {
        const { token } = req.body;

        try {
            if (!token) throw new AccessError();
            this.auth.verify(token);

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async verifyUserEmail(req: Request, res: Response): Promise<void> {
        const { token } = req.body;

        try {
            if (!token) throw new AccessError();
            this.auth.appTokenCheck(req);

            const
            { email } = this.auth.verify(token),
            user = await User.findOne({ email, verified: false });

            if (!user) throw new NotFoundError();

            user.verified = true;
            await user.save();

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async sendVerifyMail(req: Request, res: Response): Promise<void> {
        const { email, nickname } = req.body;

        try {
            this.auth.appTokenCheck(req);

            const
            link = `https://blog.eunsatio.io/account/verify?auth=${ this.auth.sign({ email }) }`,
            mailTemplate = getVerifyMailTemplate(email, nickname, link, 'Slacking studio BLOG', 'https://blog.eunsatio.io');

            await new MailModule('"SeemsPyo" <eunsatio@eunsatio.io>')
            .send(email, '[Slacking studio] - Please verify your email adress', mailTemplate);

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private userPayloadTransform(clone: BlogUser): any {
        delete clone.password;
        delete clone.date;
        delete clone.introduction;

        return clone;
    }

}