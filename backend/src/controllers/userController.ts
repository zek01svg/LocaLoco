import { Request, Response, NextFunction } from "express";
import UserModel from "../models/UserModel.js";

class UserController {

    // // Get user profile
    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = String(req.body.userId) 
            console.log(userId)
            
            const profile = await UserModel.getProfile(userId);
            res.status(200).json(profile);
            
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }

    // Update user profile
    static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { userId, name, email, imageUrl, bio, hasBusiness } = req.body;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                process.exit(1)
            }

            // Prepare update data
            const updates: any = {};
            if (name !== undefined) updates.name = name;
            if (email !== undefined) updates.email = email;
            if (imageUrl !== undefined) updates.imageUrl = imageUrl;
            if (bio !== undefined) updates.bio = bio;
            if (hasBusiness !== undefined) updates.hasBusiness = hasBusiness;
            updates.updatedAt = new Date().toISOString()

            const updatedUser = await UserModel.updateProfile(userId, updates);
            res.status(200).json(updatedUser)
        } 
        catch (error: any) {
            console.error(`Error updating user details: ${error}`)
        }
    }

    // delete user profile
    static async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.body.userId

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            await UserModel.deleteProfile(userId)

            res.status(200).json({
                message: 'Profile deleted successfully',
            });
        } 
        catch (error: any) {
            console.log(`Error deleting profile: ${error}`)
        }
    }

    // handle referrals
    static async handleReferral(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const referralCode = req.body.referralCode
            const referredId = req.body.referredId

            const userExists = await UserModel.handleReferral(referralCode, referredId)

            if (userExists === false) {
                res.status(404).json({
                    message: 'The referral code entered doesnt exist.',
                });
            }

            res.status(200).json({
                message: 'Referral handled successfully',
            });
            
        } 
        catch (error: any) {
            console.log(`Error handling referral: ${error}`)
        }
    }
}

export default UserController;