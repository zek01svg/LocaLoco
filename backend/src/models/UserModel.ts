import { User, UpdateProfileData } from '../types/User.js';
import db from '../database/db.js'
import { referrals, user, userPoints, vouchers } from '../database/schema.js';
import { and, or, ilike, eq, inArray, gte, sql, asc, desc } from 'drizzle-orm';
import { date } from 'better-auth';

class UserModel {
    
    /**
     * Retrieves a user record from the database by its unique ID.
     * 
     * Searches the `user` table for a record that matches the provided `userId`. 
     * Returns the first matching user object if found, or `null` if no such user exists.
     * 
     * @param {string} userId - The unique identifier of the user.
     * @returns {Promise<User | null>} The `User` object corresponding to the ID, or `null` if not found.
     */
    public static async getProfile(userId: string) {
        try {
            const profile = await db.select().from(user).where(eq(user.id, userId))
            const availableVouchers = await db.select().from(vouchers).where(eq(vouchers.userId, userId))
            const availablePoints = await db.select().from(userPoints).where(eq(userPoints.userEmail, profile[0]!.email))
            
            return {
                profile: profile[0],
                vouchers: availableVouchers,
                points: availablePoints[0]!.points
            }
        } 
        catch (error) {
            console.error(`Error fetching user: ${userId}`);
            throw error;
        }
    }

    /**
     * Updates the profile information of a user in the database.
     * 
     * Accepts partial updates for the user's `name`, `email`, and `image`. 
     * Only the fields provided in `updates` are modified, leaving other fields unchanged. 
     * After updating, fetches and returns the fully updated user object.
     * 
     * @param {string} userId - The unique identifier of the user to update.
     * @param {UpdateProfileData} updates - Object containing the profile fields to update.
     * @returns {Promise<User>} The updated `User` object reflecting the changes.
     */
    public static async updateProfile(userId: string, updates: UpdateProfileData) {
        try {
            // Update only the fields that are provided
            const updateData: any = {};
            if (updates.name !== undefined) updateData.name = updates.name;
            if (updates.email !== undefined) updateData.email = updates.email;
            if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;
            if (updates.bio !== undefined) updateData.bio = updates.bio;
            if (updates.hasBusiness !== undefined) updateData.hasBusiness = updates.hasBusiness;
            updateData.updatedAt = updates.updatedAt

            // Perform the update
            await db.update(user).set(updateData).where(eq(user.id, userId));

            // Return the updated user
            const updatedUser = await db.select().from(user).where(eq(user.id, userId))
            return updatedUser[0];
        } 
        catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    /**
     * Deletes a user record from the database by its unique ID.
     * 
     * Removes the user entry identified by `userId` from the `user` table. 
     * Any related data is assumed to be handled by database constraints or cascading rules.
     * 
     * @param {string} userId - The unique identifier of the user to delete.
     * @returns {Promise<void>} Resolves when the user record has been successfully removed.
     */
    public static async deleteProfile(userId: string) {
        try {
            await db.delete(user).where(eq(user.id, userId))
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    public static async handleReferral(referralCode: string, referredId: string) {
        try {

            // Check if referral code is valid
            const referrerResult = await db.select()
                .from(user)
                .where(eq(user.referralCode, referralCode));
            
            if (referrerResult.length === 0) {
                console.log("Referral check failed: Code not found.");
                return false; // Code doesn't exist
            }

            const referrerUser = referrerResult[0]!;

            // Prevent self-referral
            if (referrerUser.id === referredId) {
                console.log("Referral check failed: User cannot refer themselves.");
                return false;
            }

            // Check if user (referredId) has already been referred
            const referredUserCheck = await db.select({ 
                    referredByUserID: user.referredByUserId 
                }).from(user).where(eq(user.id, referredId));

            if (referredUserCheck[0]?.referredByUserID) {
                console.log("Referral check failed: User already has a referrer.");
                return false;
            }

            // === 2. TRANSACTION (All writes) ===
            const transactionResult = await db.transaction(async (tx) => {
                
                const now = new Date();
                const expiryDate = new Date(now);
                expiryDate.setMonth(expiryDate.getMonth() + 1);
                
                // Insert the referral record
                const referralInsertResult = await tx.insert(referrals).values({
                    referrerId: referrerUser.id,
                    referredId: referredId,
                    referralCode,
                    status: "claimed",
                    referredAt: now.toISOString() // Use 'now' for consistency
                });
                
                const newReferralId = referralInsertResult[0].insertId;

                // Insert voucher for the REFERRED user
                await tx.insert(vouchers).values({
                    userId: referredId,
                    refId: newReferralId,
                    amount: 5,
                    status: 'issued',
                    issuedAt: now.toISOString(),
                    expiresAt: expiryDate.toISOString()
                });

                // Insert voucher for the REFERRER user
                await tx.insert(vouchers).values({
                    userId: referrerUser.id,
                    refId: newReferralId,
                    amount: 5,
                    status: 'issued',
                    issuedAt: now.toISOString(),
                    expiresAt: expiryDate.toISOString()
                });

                // update the new user referredByUserID column
                await tx.update(user).set({
                    referredByUserId: referrerUser.id,
                }).where(eq(user.id, referredId))

                return true;
            });
            
            return transactionResult; 
        } 
        catch (error) {

            console.error('Error handling referral:', error);
            throw error; 
        }
    }
}

export default UserModel