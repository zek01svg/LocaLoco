import { Request, Response, NextFunction } from "express";
import ReviewModel from "../models/ReviewModel.js";
import ForumModel from "../models/ForumModel.js";

class FeatureController {

    static async getBusinessReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reviews = await ReviewModel.getBusinessReviews(String(req.query.uen));
            res.status(200).json(reviews)
        } 
        catch (error) {
            next(error);
        }
    }

    static async newReview (req: Request, res: Response, next: NextFunction): Promise<void> {

        const review = { 
            userEmail: req.body.userEmail, 
            businessUEN: req.body.businessUEN,
            title: req.body.title,
            body: req.body.body,
            rating: req.body.rating
        };


        try {
            await ReviewModel.newReview(review);
            res.status(200).json({ message: "Review added!" });
        } 
        catch (error) {
            console.error("❌ Error adding review:", error);
            next(error);
        }
    }

    // ---------------------- FORUM STUFF HERE ----------------------

    static async getAllForumPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const forumPosts = await ForumModel.getAllForumPosts();
            res.status(200).json(forumPosts)
        } 
        catch (error) {
            next(error);
        }
    }

    static async newForumPost(req: Request, res: Response, next: NextFunction): Promise<void> {

        const post = { 
            userEmail: req.body.userEmail, 
            businessUen: req.body.businessUEN, 
            title: req.body.title,
            body: req.body.body
         };

        try {
            await ForumModel.newForumPost(post);
            res.status(200).json({ message: "Post added!" });
        } 
        catch (error) {
            console.error("❌ Error adding post:", error);
            next(error);
        }
    }
}

export default FeatureController