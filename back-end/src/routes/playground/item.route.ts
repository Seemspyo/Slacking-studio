import { resolve } from "path";

/** Custom Modules */
import Route from "../route";
import { AuthModule } from "../../modules/auth.module";
import { ErrorHandler, ForbiddenError } from "../../modules/error.module";
import { UploadModule, removeFile } from "../../modules/upload.module";

/**Types */
import { Application, Request, Response, NextFunction } from "express";
import { MulterFile } from "../../modules/@types";

/** Models */
import { Item } from "../../connections/playground.connection";


export default class ItemRoute extends Route {

    private error: ErrorHandler;
    private auth: AuthModule;

    constructor(app: Application, handlers: { auth: AuthModule; error: ErrorHandler }) {
        super(app);
        Object.assign(this, handlers);

        this.routes = [
            { method: 'get', path: '/items', handler: this.getItemAll.bind(this) },
            { method: 'post', path: '/item', handler: this.checkAuthority.bind(this) },
            { method: 'post', path: '/item', handler: this.createItem.bind(this) },
            { method: 'all', path: '/item/:id', handler: this.checkAuthority.bind(this) },
            { method: 'put', path: '/item/:id', handler: this.updateItem.bind(this) },
            { method: 'delete', path: '/item/:id', handler: this.deleteItem.bind(this) }
        ]
    }

    private async getItemAll(req: Request, res: Response): Promise<void> {
        const { search, status } = req.query;

        try {
            this.auth.appTokenCheck(req);

            const criteria: { [option: string]: any } = new Object();
            if (search) criteria.$or = [
                { 'title.ko': { $regex: search, $options: 'i' } },
                { 'title.en': { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ]
            if (status && status === 'true') criteria.status = true;
            else {
                const user = this.auth.userTokenCheck(req.headers);
                if (!(user && user.authorized)) throw new ForbiddenError();
            }

            const items = await Item.find(criteria)
            .sort('-createdAt');

            res.status(200).json(items);
        } catch (error) {
            this.error.handle(error, res);
        }
    }

    private checkAuthority(req: Request, res: Response, next: NextFunction): void {
        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (!(user && user.authorized)) throw new ForbiddenError();

            next();
        } catch (error) {
            this.error.handle(error, res);
        }
    }

    private async createItem(req: Request, res: Response): Promise<void> {
        const uploader = new UploadModule('/item/images', 'thumbnailImage', '../host/playground/data', 'thumbnail-img');
        let thumbnail: MulterFile;

        try {
            thumbnail = (await uploader.upload(req)) as MulterFile;

            const { thumbnailImage, title, uri, description, author, status, tags } = req.body;

            const item = new Item({
                thumbnailImage: thumbnail && {
                    path: uploader.toRelativePath(thumbnail.path),
                    name: thumbnailImage.name
                },
                title,
                uri,
                description,
                author,
                createdAt: new Date(),
                status,
                tags: tags || []
            });

            await item.save();

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.error.handle(error, res);
        }
    }

    private async updateItem(req: Request, res: Response): Promise<void> {
        const
        { id } = req.params,
        uploader = new UploadModule('/item/images', 'thumbnailImage', '../host/playground/data', 'thumbnail-img');

        try {
            const thumbnail = (await uploader.upload(req)) as MulterFile;

            const
            item = await Item.findOne({ _id: id }),
            updates = { ...req.body }

            if (thumbnail) {
                if (item.thumbnailImage && item.thumbnailImage.path) uploader.removeFile(uploader.toAbsolutePath(item.thumbnailImage.path));

                updates.thumbnailImage.path = uploader.toRelativePath(thumbnail.path);
            }

            for (const key in updates) item[key] = updates[key];
            await item.save();

            res.status(200).json(item);
        } catch (error) {
            this.error.handle(error, res);
        }
    }

    private async deleteItem(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const item = await Item.findOneAndDelete({ _id: id });
            if (item.thumbnailImage && item.thumbnailImage.path) removeFile(resolve(__dirname, item.thumbnailImage.path));

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.error.handle(error, res);
        }
    }

}