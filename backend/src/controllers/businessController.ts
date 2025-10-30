import { Request, Response, NextFunction } from 'express';
import BusinessModel from '../models/BusinessModel.js';

class businessController {

    static async getAllBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const businesses = await BusinessModel.getAllBusinesses();
            res.status(200).json(businesses)
        } 
        catch (error) {
            console.error(`There was a problem fetching the businesses: ${error}`)
            next(error);
        }
    }

    static async getFilteredBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filteredBusinesses = await BusinessModel.getFilteredBusinesses(req.body);
            res.status(200).json(filteredBusinesses)            
        } 
        catch (error) {
            console.error(`There was a problem fetching the filtered businesses: ${error}`)
            next(error);
        }
    }

    static async getBusinessByUEN(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const business = await BusinessModel.getBusinessByUEN(String(req.query.uen))
            res.status(200).json(business);
        } 
        catch (error) {
            console.error(`There was a problem fetching the selected business: ${error}`)
            next(error);
        }
    }

    static async registerBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {

        const business = {
            uen: req.body.uen,
            businessName: req.body.businessName,
            businessCategory: req.body.businessCategory,
            description: req.body.description,
            address: req.body.address,
            open247: req.body.open247 ? 1 : 0,
            openingHours: req.body.openingHours, 
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            websiteLink: req.body.websiteLink ?? '',
            socialMediaLink: req.body.socialMediaLink ?? '',
            wallpaper: req.body.wallpaper,
            dateOfCreation: req.body.dateOfCreation,
            priceTier: req.body.priceTier,
            offersDelivery: req.body.offersDelivery ? 1 : 0,
            offersPickup: req.body.offersPickup ? 1 : 0,
            paymentOptions: req.body.paymentOptions
        }

        try {
            const result = await BusinessModel.registerBusiness(business)
            res.status(200).json({ message: 'business registered' });
        }
        catch (err:any) {
            console.error(`There was a problem registering the selected business: ${err}`)
            next(err)
        }
    }
}

export default businessController