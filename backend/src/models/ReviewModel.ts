import { Review } from '../types/Review.js';
import db from '../database/db.js'
import { businessReviews } from '../database/schema.js';
import { eq } from 'drizzle-orm';


class ReviewModel {
    
    // CREATE
    public static async newReview (userEmail:string, businessUEN:string, rating:number, body:string|null) {
        // await db.insert(users).values({ name: 'Andrew' });

        await db.insert(businessReviews).values({
            userEmail,
            businessUen:businessUEN,
            rating:rating,
            body: body ?? '',
            createdAt: new Date().toISOString()
        } as typeof businessReviews.$inferInsert) 
    }
    // READ
    public static async getBusinessReviews(businessUEN:string) {
        return await db.select().from(businessReviews).where(eq(businessReviews.businessUen, businessUEN))
    }
}

export default ReviewModel