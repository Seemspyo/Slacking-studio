import { resolve } from 'path';

/** Custom Modules */
import { BlogRoute } from "./blog.route";
import { ForbiddenError, NotFoundError } from "../../modules/error.module";
import { UploadModule, removeFile } from "../../modules/upload.module";

/** Types */
import { Application, Request, Response, NextFunction } from "express";
import { MulterFile } from "../../modules/@types";
import multer from "multer";

/** Models */
import { User } from "../../connections/blog.connection";


export default class UserRoute extends BlogRoute {

    constructor(app: Application) {
        super(app);

        this.routes = [
            { method: 'get', path: '/users', handler: this.getUserAll.bind(this) },
            { method: 'get', path: '/user/public/:email', handler: this.getUserPublic.bind(this) },
            { method: 'all', path: '/user/:email', handler: this.checkAuthority.bind(this) },
            { method: 'get', path: '/user/:email', handler: this.getUser.bind(this) },
            { method: 'put', path: '/user/:email', handler: this.updateUser.bind(this) },
            { method: 'delete', path: '/user/:email', handler: this.deleteUser.bind(this) }
        ]
    }

    private async getUserAll(req: Request, res: Response): Promise<void> {
        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (!user.level || user.level < 10) throw new ForbiddenError();

            const users = await User.find().select('-password');

            res.status(200).json(users);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async getUserPublic(req: Request, res: Response): Promise<void> {
        const { email } = req.params;

        try {
            this.auth.appTokenCheck(req);

            const user = await User.findOne({ email }).select('nickname profileImagePath profileImageFileName email introduction date');
            if (!user) throw new NotFoundError();

            res.status(200).json(user);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async checkAuthority(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email } = req.params;

        try {
            this.auth.appTokenCheck(req);

            const
            userToken = this.auth.userTokenCheck(req.headers),
            user = await User.findOne({ email });
            if (!user) throw new NotFoundError();
            if (userToken.level < 10 && userToken._id != user._id) throw new ForbiddenError();

            next();
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async getUser(req: Request, res: Response): Promise<void> {
        const { email } = req.params;

        try {
            const user = await User.findOne({ email }).select('-password');
            if (!user) throw new NotFoundError();

            res.status(200).json(user);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async updateUser(req: Request, res: Response): Promise<void> {
        const
        { email } = req.params,
        uploader = new UploadModule('/user/profile/images', 'profileImage', '../host/blog/data', 'profile-img');
        let profileImage: MulterFile;

        try {
            this.auth.appTokenCheck(req);

            profileImage = (await uploader.upload(req)) as MulterFile;

            let
            user = await User.findOne({ email }),
            updates = { ...req.body }

            delete updates.email;
            delete updates.date;

            if (updates.password) updates.password = this.cipher.publicEncrypt(updates.password);
            else delete updates.password;
            if (profileImage) {
                if (user.profileImagePath) uploader.removeFile(uploader.toAbsolutePath(user.profileImagePath));

                updates.profileImagePath = uploader.toRelativePath(profileImage.path);
                delete updates.profileImage;
            }

            for (const key in updates) user[key] = updates[key];
            await user.save();

            res.status(200).json(user);
        } catch (error) {
            if (!(error instanceof (multer as any).MulterError) && profileImage) uploader.removeFile(uploader.toAbsolutePath(profileImage.path));

            this.errorHandler.handle(error, res);
        }
    }

    private async deleteUser(req: Request, res: Response): Promise<void> {
        const { email } = req.params;

        try {
            const user = await User.findOneAndDelete({ email });
            if (user.profileImagePath) removeFile(resolve(__dirname, user.profileImagePath));

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

}