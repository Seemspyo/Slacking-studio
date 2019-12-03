/** Custom Modules */
import { BlogRoute } from "./blog.route";
import { ForbiddenError, AccessError } from "../../modules/error.module";

/** Types */
import { Application, Request, Response, NextFunction } from "express";

/** Models */
import { Comment, Article } from "../../connections/blog.connection";


export default class CommentRoute extends BlogRoute {

    private readonly USER_PUBLIC = 'username nickname email profileImagePath date';

    constructor(app: Application) {
        super(app);

        this.routes = [
            { method: 'get', path: '/comments', handler: this.getCommentAll.bind(this) },
            { method: 'get', path: '/comments/:id', handler: this.getCommentByUser.bind(this) },
            { method: 'post', path: '/comment', handler: this.writeComment.bind(this) },
            { method: 'all', path: '/comment/:commentId', handler: this.checkAuthority.bind(this) },
            { method: 'put', path: '/comment/:commentId', handler: this.updateComment.bind(this) },
            { method: 'delete', path: '/comment/:commentId', handler: this.deleteComment.bind(this) }
        ]
    }

    private async getCommentAll(req: Request, res: Response): Promise<void> {
        const { article } = req.query;

        try {
            this.auth.appTokenCheck(req);

            const comments = await Comment.find(article ? { article: article } : null)
            .select('-password')
            .populate('article', 'title category')
            .populate('author', this.USER_PUBLIC);

            res.status(200).json(comments);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async getCommentByUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            this.auth.appTokenCheck(req);
            if (!id) throw new AccessError();

            const user = this.auth.userTokenCheck(req.headers);
            if (user.level < 1 || (user.level < 8 && user._id != id)) throw new ForbiddenError();

            const comments = await Comment.find({ author: id })
            .populate('article', 'title category')
            .populate('parent', 'nickname');

            res.status(200).json(comments);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async writeComment(req: Request, res: Response): Promise<void> {
        const { article, author, content, parent } = req.body;

        try {
            this.auth.appTokenCheck(req);

            const
            now = new Date(),
            commentDoc: any = {
                article,
                content,
                date: {
                    createdAt: now,
                    lastUpdatedAt: now
                },
                parent
            }

            if (author) {
                const user = this.auth.userTokenCheck(req.headers);
                if (user.level < 1) throw new ForbiddenError();

                commentDoc.author = user._id;
            } else {
                const { nickname, password } = req.body;
                if (!nickname || !password) throw new AccessError();

                commentDoc.nickname = nickname;
                commentDoc.password = password;
            }

            const comment = new Comment(commentDoc);

            await comment.save();
            await Article.findOneAndUpdate({ _id: article }, { $push: { comments: comment._id } });
            await Comment.populate([comment], { path: 'author', select: this.USER_PUBLIC });

            res.status(200).json(comment);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async checkAuthority(req: Request, res: Response, next: NextFunction): Promise<void> {
        const
        { commentId } = req.params,
        password = req.body.password || req.query.password;

        try {
            this.auth.appTokenCheck(req);

            const comment = await Comment.findOne({ _id: commentId });

            if (comment.author) {
                const user = this.auth.userTokenCheck(req.headers);
                if (user.level < 8 && user._id != comment.author) throw new ForbiddenError();
            } else {
                if (password !== comment.password) {
                    const user = this.auth.userTokenCheck(req.headers);
                    if (user.level < 8) throw new ForbiddenError();
                }
            }

            next();
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async updateComment(req: Request, res: Response): Promise<void> {
        const
        { commentId } = req.params,
        { content, deleted } = req.body;

        const updates: any = { 'date.lastUpdatedAt': new Date() }
        if (content) updates.content = content;
        if (deleted) updates.deleted = deleted;

        try {
            const comment = await Comment.findOneAndUpdate({ _id: commentId }, updates, { new: true })
            .select('-password')
            .populate('author', this.USER_PUBLIC);

            res.status(200).json(comment);
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    private async deleteComment(req: Request, res: Response): Promise<void> {
        const { commentId } = req.params;

        try {
            await Comment.findOneAndDelete({ _id: commentId });

            res.status(200).json({ result: 1 });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

}