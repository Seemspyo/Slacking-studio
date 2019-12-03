/** Custom Modules */
import { BlogRoute } from "./blog.route";
import { NotFoundError, ForbiddenError, AccessError } from "../../modules/error.module";

/** Models */
import { Article, Comment, User } from "../../connections/blog.connection";

/** Types */
import { Application, Request, Response, NextFunction } from "express";

export default class AnalyticsRoute extends BlogRoute {

    constructor(app: Application) {
        super(app);

        this.routes = [
            { method: 'get', path: '/analytics/*', handler: this.checkAuthority.bind(this) },
            { method: 'get', path: '/analytics/counts', handler: this.getCount.bind(this) }
        ]
    }

    public async checkAuthority(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            this.auth.appTokenCheck(req);

            const user = this.auth.userTokenCheck(req.headers);
            if (!user.level || user.level < 8) throw new ForbiddenError();

            next();
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

    public async getCount(req: Request, res: Response): Promise<void> {
        const { key } = req.query;

        try {
            let count: number;

            switch (key) {
                case 'user-active':
                    count = await User.countDocuments({ level: { $gt: 0 }, verified: true });
                    break;
                case 'article-public':
                    count = await Article.countDocuments({ status: true });
                    break;
                case 'article-view':
                    const aggregation = await Article.aggregate([
                        { $match: { status: true } },
                        { $group: { _id: null, view: { $sum: '$view' } } }
                    ]);

                    count = aggregation[0] && aggregation[0].view;
                    break;
                case 'comment':
                    count = await Comment.countDocuments();
                    break;
                default:
                    throw new AccessError();
            }

            res.status(200).json({ count });
        } catch (error) {
            this.errorHandler.handle(error, res);
        }
    }

}