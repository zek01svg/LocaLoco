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
    
    static async getAllForumPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const forumPosts = await ForumModel.getAllForumPosts();
            res.status(200).json(forumPosts)
        } 
        catch (error) {
            next(error);
        }
    }
}

export default FeatureController