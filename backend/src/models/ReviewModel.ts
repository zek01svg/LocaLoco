import { Review, UpdateReviewData } from '../types/Review.js';
import db from '../database/db.js'
import { businessReviews } from '../database/schema.js';
import { eq } from 'drizzle-orm';

class ReviewModel {
    
    // CREATE
    public static async newReview (review: Omit<Review, 'id'>) {

        try {
            await db.insert(businessReviews).values({
                userEmail: review.userEmail,
                businessUen: review.businessUEN,
                rating: review.rating,
                body: review.body ?? '',
                likeCount: review.likeCount,
                createdAt:review.createdAt

            } as typeof businessReviews.$inferInsert)
        }
        catch (err) {
            console.error(err)
        }
    }
    // READ
    public static async getBusinessReviews(uen:string) {
        try {
            const reviews = await db.select().from(businessReviews).where(eq(businessReviews.businessUen, uen))
            return reviews
        } 
        catch (err) {
            console.error(err)
        }
    }    
    // UPDATE
    public static async updateReview(id:number, updatedReview:UpdateReviewData) {
        try {
            await db.update(businessReviews).set(updatedReview).where(eq(businessReviews.id, id))
        } 
        catch (err) {
            console.error(`Error updating review: ${err}`)
            throw err
        }
    }    
    // DELETE
    public static async deleteReview(id:number) {
        try {
            await db.delete(businessReviews).where(eq(businessReviews.id, id))
        } 
        catch (err) {
            console.error(`Error deleting review: ${err}`)
            throw err
        }
    }    
    // handle likes for reviews
    public static async updateReviewLikes(reviewId: number, clicked: boolean = false) {
        const [review] = await db.select().from(businessReviews).where(eq(businessReviews.id, reviewId))

        if (!review) {
            throw new Error(`Reply with ID ${reviewId} not found.`)
        }

        const newLikeCount = clicked
            ? (review.likeCount ?? 0) + 1
            : Math.max((review.likeCount ?? 0) - 1, 0);

        await db.update(businessReviews)
            .set({ likeCount: newLikeCount })
            .where(eq(businessReviews.id, reviewId));

        return { 
            ...review, 
            likeCount: newLikeCount 
        }
    }
}

export default ReviewModel