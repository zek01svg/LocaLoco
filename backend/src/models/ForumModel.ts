import { ForumPost, ForumPostReply } from '../types/ForumPost.js';
import db from '../database/db.js'
import { forumPosts, forumPostsReplies } from '../database/schema.js';
import { eq } from 'drizzle-orm';
import { error } from 'console';

class ForumModel {

    // creates a new forum post
    public static async newForumPost(post: Omit<ForumPost, 'id' | 'replies'>) {
        
        try {
            await db.insert(forumPosts).values({
                userEmail: post.userEmail,
                businessUen: post.businessUen || null,
                title: post.title || null,
                body: post.body,
                createdAt: post.createdAt,
                likeCount: 0

            } as typeof forumPosts.$inferInsert)
        }
        catch (err) {
            console.error(err)
        }
    }

    // get all forum posts
    public static async getAllForumPosts(): Promise<ForumPost[]> {
        
        // select the main posts first
        const posts = await db.select().from(forumPosts)

        const container: ForumPost[] = [];

        // fetch the replies to the posts and map them to their parents
        for (let post of posts) {
            // fetch replies for this post
            const replies = await db.select().from(forumPostsReplies).where(eq(forumPostsReplies.postId, post.id));

            // map replies to ForumPost interface
            const mappedReplies: ForumPostReply[] = replies.map(r => ({
                id: r.id,
                postId: r.postId,
                userEmail: r.userEmail,
                body: r.body,
                likeCount: r.likeCount,
                createdAt: r.createdAt,
            }));
            
            // push post with its replies
            container.push({
                id: post.id,
                userEmail: post.userEmail,
                businessUen: post.businessUen,
                title: post.title || null,
                body: post.body,
                likeCount: post.likeCount!,
                createdAt: post.createdAt!,
                replies: mappedReplies
            });
        }

        return container;
    }


    // handle likes for posts
    public static async updatePostLikes(postId: number, clicked: boolean = false) {
        // clicked = true → user liked → increment
        // clicked = false → user unliked → decrement
        const posts  = await db.select().from(forumPosts).where(eq(forumPosts.id, postId))
        const post = posts[0]

        if (!post) {
            throw new Error(`Post with ID ${postId} not found.`)
        }

        const newLikeCount = clicked 
            ? (post.likeCount ?? 0) + 1
            : Math.max((post.likeCount ?? 0) - 1, 0); // prevent negative likes

        await db.update(forumPosts)
            .set({ likeCount: newLikeCount })
            .where(eq(forumPosts.id, postId));

        return { ...post, likeCount: newLikeCount };
    }


    // handle likes for replies
    public static async updateReplyLikes(replyId: number, clicked: boolean = false) {
        const [reply] = await db.select().from(forumPostsReplies).where(eq(forumPostsReplies.id, replyId));

        if (!reply) {
            throw new Error(`Reply with ID ${replyId} not found.`)
        }

        const newLikeCount = clicked
            ? (reply.likeCount ?? 0) + 1
            : Math.max((reply.likeCount ?? 0) - 1, 0);

        await db.update(forumPostsReplies)
            .set({ likeCount: newLikeCount })
            .where(eq(forumPostsReplies.id, replyId));

        return { ...reply, likeCount: newLikeCount };
    }
}

export default ForumModel