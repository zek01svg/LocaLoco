import { Request, Response, NextFunction } from 'express';
import BusinessModel from '../models/BusinessModel.js';
import UserModel from '../models/UserModel.js';

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

    static async searchBusinessByName(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const searchName = String(req.query.name || '').trim();

            if (!searchName) {
                res.status(400).json({ error: 'Name parameter is required' });
                return;
            }

            const business = await BusinessModel.searchBusinessByName(searchName);

            if (!business) {
                res.status(404).json({ error: 'Business not found' });
                return;
            }

            res.status(200).json(business);
        }
        catch (error) {
            console.error(`There was a problem searching for business: ${error}`)
            next(error);
        }
    }

    static async getOwnedBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body.ownerId)
            const ownedBusinesses = await BusinessModel.getOwnedBusinesses(String(req.body.ownerId))
            res.status(200).json(ownedBusinesses);
        }
        catch (error) {
            console.error(`There was a problem fetching the the owned business: ${error}`)
            next(error);
        }
    }

    static async registerBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {

        const business = {
            ownerId: req.body.ownerId,
            uen: req.body.uen,
            businessName: req.body.businessName,
            businessCategory: req.body.businessCategory,
            description: req.body.description,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
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
            await BusinessModel.registerBusiness(business)
            res.status(200).json({ 
                success: true, 
                message: 'business registered' 
            });
        }
        catch (err:any) {
            console.error(`There was a problem registering the selected business: ${err}`)
            next(err)
        }
    }

    static async updateBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {

        const business = {
            ownerID: req.body.ownerID,
            uen: req.body.uen,
            businessName: req.body.businessName,
            businessCategory: req.body.businessCategory,
            description: req.body.description,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            open247: req.body.open247 ? 1 : 0,
            openingHours: req.body.openingHours, 
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            websiteLink: req.body.websiteLink ?? '',
            socialMediaLink: req.body.socialMediaLink ?? '',
            wallpaper: req.body.wallpaper,
            priceTier: req.body.priceTier,
            offersDelivery: req.body.offersDelivery ? 1 : 0,
            offersPickup: req.body.offersPickup ? 1 : 0,
            paymentOptions: req.body.paymentOptions
        }

        try {
            await BusinessModel.updateBusiness(business)
            res.status(200).json({ message: 'business updated' });
        }
        catch (err:any) {
            console.error(`There was a problem registering the selected business: ${err}`)
            next(err)
        }
    }

    static async deleteBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {

        const uen = String(req.body.uen)

        try {
            await BusinessModel.deleteBusiness(uen)
            res.status(200).json({ message: 'business deleted' });
        }
        catch (err:any) {
            console.error(`There was a problem deleting the selected business: ${err}`)
            next(err)
        }
    }
}

export default businessController