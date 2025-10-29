import { Review } from '../types/Review.js';
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
    public static async getBusinessReviews(businessUEN:string) {
        try {
            return await db.select().from(businessReviews).where(eq(businessReviews.businessUen, businessUEN))
        } 
        catch (err) {
            console.error(err)
        }
    }    
}

export default ReviewModel