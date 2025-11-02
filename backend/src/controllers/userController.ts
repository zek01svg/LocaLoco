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
            const { userId, name, image } = req.body;

            console.log('Update profile request:', { userId, name, imageLength: image?.length });

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            // Prepare update data
            const updates: any = {};
            if (name !== undefined) updates.name = name;
            if (image !== undefined) updates.image = image;

            // Check if there's anything to update
            if (Object.keys(updates).length === 0) {
                res.status(400).json({ error: 'No fields to update' });
                return;
            }

            console.log('Updates to apply:', Object.keys(updates));

            const updatedUser = await UserModel.updateProfile(userId, updates);

            if (!updatedUser) {
                res.status(404).json({ error: 'User not found after update' });
                return;
            }

            res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    image: updatedUser.image,
                    createdAt: updatedUser.createdAt,
                }
            });
        } catch (error: any) {
            if (error.message === 'User not found') {
                res.status(404).json({ error: 'User not found' });
            } else {
                console.error('Error updating profile:', error);
                res.status(500).json({ error: 'Failed to update profile' });
            }
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