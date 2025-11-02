import { relations } from "drizzle-orm/relations";
import { user, account, bookmarkedBusinesses, businesses, businessAnnouncements, businessOpeningHours, businessPaymentOptions, businessReviews, forumPosts, forumPostsReplies, referrals, session, vouchers } from "./schema.js";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	bookmarkedBusinesses: many(bookmarkedBusinesses),
	businessReviews: many(businessReviews),
	businesses: many(businesses),
	forumPosts: many(forumPosts),
	forumPostsReplies: many(forumPostsReplies),
	referrals_referredId: many(referrals, {
		relationName: "referrals_referredId_user_id"
	}),
	referrals_referrerId: many(referrals, {
		relationName: "referrals_referrerId_user_id"
	}),
	sessions: many(session),
	vouchers: many(vouchers),
}));

export const bookmarkedBusinessesRelations = relations(bookmarkedBusinesses, ({one}) => ({
	user: one(user, {
		fields: [bookmarkedBusinesses.userId],
		references: [user.id]
	}),
	business: one(businesses, {
		fields: [bookmarkedBusinesses.businessUen],
		references: [businesses.uen]
	}),
}));

export const businessesRelations = relations(businesses, ({one, many}) => ({
	bookmarkedBusinesses: many(bookmarkedBusinesses),
	businessAnnouncements: many(businessAnnouncements),
	businessOpeningHours: many(businessOpeningHours),
	businessPaymentOptions: many(businessPaymentOptions),
	businessReviews: many(businessReviews),
	user: one(user, {
		fields: [businesses.ownerID],
		references: [user.id]
	}),
	forumPosts: many(forumPosts),
}));

export const businessAnnouncementsRelations = relations(businessAnnouncements, ({one}) => ({
	business: one(businesses, {
		fields: [businessAnnouncements.businessUen],
		references: [businesses.uen]
	}),
}));

export const businessOpeningHoursRelations = relations(businessOpeningHours, ({one}) => ({
	business: one(businesses, {
		fields: [businessOpeningHours.uen],
		references: [businesses.uen]
	}),
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

export const referralsRelations = relations(referrals, ({one, many}) => ({
	user_referredId: one(user, {
		fields: [referrals.referredUserId],
		references: [user.id],
		relationName: "referrals_referredId_user_id"
	}),
	user_referrerId: one(user, {
		fields: [referrals.referrerUserId],
		references: [user.id],
		relationName: "referrals_referrerId_user_id"
	}),
	vouchers: many(vouchers),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const vouchersRelations = relations(vouchers, ({one}) => ({
	referral: one(referrals, {
		fields: [vouchers.refId],
		references: [referrals.id]
	}),
	user: one(user, {
		fields: [vouchers.userId],
		references: [user.id]
	}),
}));