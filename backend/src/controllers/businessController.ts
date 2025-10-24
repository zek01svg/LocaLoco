import { Request, Response, NextFunction } from 'express';
import BusinessModel from '../models/BusinessModel.js';

class businessController {

    static async getAllBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const businesses = await BusinessModel.getAllBusinesses();
            res.status(200).json(businesses)
        } 
        catch (error) {
            next(error);
        }
    }

    static async getFilteredBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filteredBusinesses = await BusinessModel.getFilteredBusinesses(req.body);
            res.status(200).json(filteredBusinesses)            
        } 
        catch (error) {
            next(error);
        }
    }

    static async getBusinessByUEN(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const business = await BusinessModel.getBusinessByUEN(String(req.query.uen))
            res.status(200).json(business);
        } 
        catch (error) {
            next(error);
        }
    }
}

export default businessController