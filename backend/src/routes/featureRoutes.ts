import { Router } from "express";
import FeatureController from "../controllers/featureController.js";

const featureRouter = Router()

// this route fetches all the reviews for a business
featureRouter.get('/api/reviews', FeatureController.getBusinessReviews.bind(FeatureController))

export default featureRouter