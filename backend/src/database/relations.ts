import { relations } from "drizzle-orm/relations";
import { user, account, businesses, businessOpeningHours, businessPaymentOptions, businessReviews, forumPosts, forumPostsReplies, referrals, session, vouchers } from "./schema.js";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	businessReviews: many(businessReviews),
	businesses: many(businesses),
	forumPosts: many(forumPosts),
	forumPostsReplies: many(forumPostsReplies),
	referrals_referredUserId: many(referrals, {
		relationName: "referrals_referredUserId_user_id"
	}),
	referrals_referrerUserId: many(referrals, {
		relationName: "referrals_referrerUserId_user_id"
	}),
	sessions: many(session),
	vouchers_referredUserId: many(vouchers, {
		relationName: "vouchers_referredUserId_user_id"
	}),
	vouchers_referrerUserId: many(vouchers, {
		relationName: "vouchers_referrerUserId_user_id"
	}),
}));

export const businessOpeningHoursRelations = relations(businessOpeningHours, ({one}) => ({
	business: one(businesses, {
		fields: [businessOpeningHours.uen],
		references: [businesses.uen]
	}),
}));

export const businessesRelations = relations(businesses, ({one, many}) => ({
	businessOpeningHours: many(businessOpeningHours),
	businessPaymentOptions: many(businessPaymentOptions),
	businessReviews: many(businessReviews),
	user: one(user, {
		fields: [businesses.ownerID],
		references: [user.id]
	}),
	forumPosts: many(forumPosts),
}));

export const businessPaymentOptionsRelations = relations(businessPaymentOptions, ({one}) => ({
	business: one(businesses, {
		fields: [businessPaymentOptions.uen],
		references: [businesses.uen]
	}),
}));

export const businessReviewsRelations = relations(businessReviews, ({one}) => ({
	business: one(businesses, {
		fields: [businessReviews.uen],
		references: [businesses.uen]
	}),
	user: one(user, {
		fields: [businessReviews.userEmail],
		references: [user.email]
	}),
}));

export const forumPostsRelations = relations(forumPosts, ({one, many}) => ({
	business: one(businesses, {
		fields: [forumPosts.uen],
		references: [businesses.uen]
	}),
	user: one(user, {
		fields: [forumPosts.userEmail],
		references: [user.email]
	}),
	forumPostsReplies: many(forumPostsReplies),
}));

export const forumPostsRepliesRelations = relations(forumPostsReplies, ({one}) => ({
	user: one(user, {
		fields: [forumPostsReplies.userEmail],
		references: [user.email]
	}),
	forumPost: one(forumPosts, {
		fields: [forumPostsReplies.postId],
		references: [forumPosts.id]
	}),
}));

export const referralsRelations = relations(referrals, ({one}) => ({
	user_referredUserId: one(user, {
		fields: [referrals.referredUserId],
		references: [user.id],
		relationName: "referrals_referredUserId_user_id"
	}),
	user_referrerUserId: one(user, {
		fields: [referrals.referrerUserId],
		references: [user.id],
		relationName: "referrals_referrerUserId_user_id"
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const vouchersRelations = relations(vouchers, ({one}) => ({
	user_referredUserId: one(user, {
		fields: [vouchers.referredUserId],
		references: [user.id],
		relationName: "vouchers_referredUserId_user_id"
	}),
	user_referrerUserId: one(user, {
		fields: [vouchers.referrerUserId],
		references: [user.id],
		relationName: "vouchers_referrerUserId_user_id"
	}),
}));