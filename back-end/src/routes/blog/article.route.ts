/** Core Modules */
import { resolve } from "path";

/** Custom Modules */
import { BlogRoute } from "./blog.route";
import { NotFoundError, ForbiddenError, AccessError } from "../../modules/error.module";
import { UploadModule, removeFile } from "../../modules/upload.module";

/** Models */
import { Article, Comment } from "../../connections/blog.connection";

/** Types */
import { Application, Request, Response, NextFunction } from "express";
import { MulterFile } from "../../modules/@types";


export default class ArticleRoute extends BlogRoute {

    private readonly USER_PUBLIC = 'username nickname email profileImagePath';

    constructor(app: Application) {
        super(app);

        this.routes = [
            { method: 'get', path: '/articles', handler: this.getArticleAll.bind(this) },
            { method: 'get', path: '/articles/:id', handler: this.getBookmarkByUser.bind(this) },
            { method: 'get', path: '/article/:title', handler: this.getArticleByTitle.bind(this) },
            { method: 'post', path: '/article', handler: this.writeArticle.bind(this) },
            { method: 'all', path: '/article/:title', handler: this.checkAuthority.bind(this) },
            { method: 'put', path: '/article/:title', handler: this.updateArticle.bind(this) },
            { method: 'delete', path: '/article/:title', handler: this.deleteArticle.bind(this) },
            { method: 'post', path: '/article-likes/:title', handler: this.addLikeToArticle.bind(this) },
            { method: 'delete', path: '/article-likes/:title', handler: this.pullLikeToArticle.bind(this) },
            { method: 'get', path: '/categories', handler: this.getCategoryAll.bind(this) },
            { method: 'get', path: '/tags', handler: this.getTagAll.bind(this) },
            { method: 'post', path: '/upload/image', handler: this.uploadImage.bind(this) },
            { method: 'delete', path: '/upload/image', handler: this.deleteImage.bind(this) }
        ]
    }

    private async getArticleAll(req: Request, res: Response): Promise<void> {
        const { skip, limit, category, search, status, bookmark } = req.query;

        try {
            this.auth.appTokenCheck(req);

            const criteria: { [option: string]: any } = new Object();
            if (category) criteria.category = category;
            if (status !== void(0)) criteria.status = status == 'true' ? true : false;
            if (search) criteria.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ]
            if (bookmark) criteria.likes = bookmark;

            const
            totalCount = await Article.countDocuments(criteria),
            articles = await Article.find(criteria)
            .sort('-date.createdAt')
            .skip(Number(skip) || 0)
            .limit(Number(limit) || 0)
            .populate('author', this.USER_PUBLIC);

            res.status(200).json({ articles, totalCount });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async getBookmarkByUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (user.level < 1 || (user.level < 8 && user._id != id)) throw new ForbiddenError();

            const articles = await Article.find({ likes: id, status: true })
            .select('title category date');

            res.status(200).json(articles);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async getArticleByTitle(req: Request, res: Response): Promise<void> {
        const
        { title } = req.params,
        updates = req.query.opened === 'false' ? { $inc: { view: 1 } } : null;

        try {
            this.auth.appTokenCheck(req);

            const article = await Article.findOneAndUpdate({ title }, updates, { new: true })
            .populate('author', this.USER_PUBLIC);
            if (!article) throw new NotFoundError();

            res.status(200).json(article);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async writeArticle(req: Request, res: Response): Promise<void> {
        const { title, category, content, author, tags, status, images } = req.body;

        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (!user.level || user.level < 8) throw new ForbiddenError();

            const
            now = new Date(),
            article = new Article({
                title,
                date: {
                    createdAt: now,
                    lastUpdatedAt: now
                },
                category,
                content,
                author,
                view: 0,
                tags,
                comments: [],
                status,
                images,
                likes: []
            });

            await article.save();

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async checkAuthority(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { title } = req.params;

        try {
            this.auth.appTokenCheck(req);

            const
            user = this.auth.userTokenCheck(req.headers),
            article = await Article.findOne({ title });
            if (user.level < 8 && user._id != article.author) throw new ForbiddenError();

            next();
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async updateArticle(req: Request, res: Response): Promise<void> {
        const
        { title } = req.params,
        updates = this.toUpdateForm(req.body);
        updates['date.lastUpdatedAt'] = new Date();

        try {
            await Article.findOneAndUpdate({ title }, updates);

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async deleteArticle(req: Request, res: Response): Promise<void> {
        const { title } = req.params;

        try {
            const article = await Article.findOneAndDelete({ title });
            await Comment.deleteMany({ articleId: article._id, nickname: /(.*?)/ });

            for (const path of article.images) removeFile(resolve(__dirname, path));

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async addLikeToArticle(req: Request, res: Response): Promise<void> {
        const { title } = req.params;

        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (!user.verified || user.level < 1) throw new ForbiddenError();

            const article = await Article.findOne({ title });
            if (!article) throw new NotFoundError();

            let result: number;

            if (!article.likes.includes(user._id)) {
                article.likes.push(user._id);
                await article.save();

                result = 1;
            } else result = 0;

            res.status(200).json({ result });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async pullLikeToArticle(req: Request, res: Response): Promise<void> {
        const { title } = req.params;

        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (!user.verified || user.level < 1) throw new ForbiddenError();

            const article = await Article.findOne({ title });
            if (!article) throw new NotFoundError();

            const articleIndex = article.likes.indexOf(user._id);
            let result: number;

            if (articleIndex >= 0) {
                article.likes.splice(article.likes.indexOf(user._id), 1);
                await article.save();

                result = 1;
            } else result = 0;

            res.status(200).json({ result });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async getCategoryAll(req: Request, res: Response): Promise<void> {
        try {
            this.auth.appTokenCheck(req);

            let search = null;
            if (req.query.status) search = { status: req.query.status }

            const categories = await Article.find(search).distinct('category');

            res.status(200).json(categories);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async getTagAll(req: Request, res: Response): Promise<void> {
        try {
            this.auth.appTokenCheck(req);

            const tags = await Article.find().distinct('tags');

            res.status(200).json(tags);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async uploadImage(req: Request, res: Response): Promise<void> {
        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (!user.level || user.level < 8) throw new ForbiddenError();

            const
            date = new Date(),
            month = date.getMonth() + 1;

            const uploader = new UploadModule(`/article/images/${ date.getFullYear() }.${ month < 10 ? '0' + month : month }/${ date.getDate() }`, 'image', '../host/blog/data', 'editor');

            const file = await uploader.upload(req) as MulterFile;
            if (!file) throw new AccessError();

            res.status(200).json({ location: uploader.toRelativePath(file.path) });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async deleteImage(req: Request, res: Response): Promise<void> {
        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (!user.level || user.level < 8) throw new ForbiddenError();

            const { path } = req.query;
            let result = 0;

            if (path) {
                removeFile(resolve(__dirname, path));
                result = 1;
            }

            res.status(200).json({ result });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

}