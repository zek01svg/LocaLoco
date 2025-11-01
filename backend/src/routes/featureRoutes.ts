import { Router } from "express";
import FeatureController from "../controllers/featureController.js";

const featureRouter = Router()

// ---------------------------------------------------- ROUTES FOR THE BUSINESS REVIEWS FEATURE ------------------------------------------
// this route fetches all the reviews for a business
featureRouter.get('/api/reviews', FeatureController.getBusinessReviews.bind(FeatureController))

// this route handles submissions for user reviews for businesses
featureRouter.post('/api/submit-review', FeatureController.newReview.bind(FeatureController))

// this route handles submissions for updated user reviews for businesses
featureRouter.post('/api/update-review', FeatureController.updateReview.bind(FeatureController))

// this route handles deletion of user reviews
featureRouter.post('/api/delete-review', FeatureController.deleteReview.bind(FeatureController))

// this route updates the likes for reviews
featureRouter.post('/api/like-review', FeatureController.updateReviewLikes.bind(FeatureController))


// ---------------------------------------------------- ROUTES FOR THE FORUM FEATURE ----------------------------------------------------
// this route fetches all the posts for the forum page
featureRouter.get('/api/forum-posts', FeatureController.getAllForumPosts.bind(FeatureController))

// this route handles submissions for forum posts
featureRouter.post('/api/submit-post', FeatureController.newForumPost.bind(FeatureController))

// this route handles submissions for replies to forum posts
featureRouter.post('/api/submit-post-reply', FeatureController.newForumPostReply.bind(FeatureController))

// this route updates the likes for forum posts 
featureRouter.post('/api/like-forum-post', FeatureController.updatePostLikes.bind(FeatureController))

// this route updates the likes for forum replies
featureRouter.post('/api/like-forum-reply', FeatureController.updateReplyLikes.bind(FeatureController))


export default featureRouter