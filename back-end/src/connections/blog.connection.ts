/** Custom Modules */
import ConnectionModule from '../modules/database-connection.module';

/** Privates */
import { BLOG_DB_USERNAME, BLOG_DB_PASSWORD, BLOG_DB_PORT } from '../privates/blog.private';

/** Schemas */
import articleSchema from '../schemas/blog/article.schema';
import commentSchema from '../schemas/blog/comment.schema';
import userSchema from '../schemas/blog/user.schema';

/** Types */
import { Model } from 'mongoose';
import { BlogUser, BlogArticle, BlogComment } from '../schemas/@types';


const
commonOptions = { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true },
blogDB = new ConnectionModule(`mongodb://${ BLOG_DB_USERNAME }:${ BLOG_DB_PASSWORD }@localhost:${ BLOG_DB_PORT }/blog`, 'Blog util', commonOptions);

export const
Article: Model<BlogArticle> = blogDB.getModel('article', articleSchema),
Comment: Model<BlogComment> = blogDB.getModel('comment', commentSchema),
User: Model<BlogUser> = blogDB.getModel('user', userSchema);