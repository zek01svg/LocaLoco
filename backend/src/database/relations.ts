import { relations } from "drizzle-orm/relations";
import { user, account, businesses, businessOpeningHours, businessPaymentOptions, businessReviews, forumPosts, forumPostsReplies, session } from "./schema.js";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	businessReviews: many(businessReviews),
	forumposts: many(forumPosts),
	forumpostsreplies: many(forumPostsReplies),
	sessions: many(session),
}));

export const businessOpeningHoursRelations = relations(businessOpeningHours, ({one}) => ({
	business: one(businesses, {
		fields: [businessOpeningHours.uen],
		references: [businesses.uen]
	}),
}));

export const businessesRelations = relations(businesses, ({many}) => ({
	businessOpeningHours: many(businessOpeningHours),
	businessPaymentOptions: many(businessPaymentOptions),
	businessReviews: many(businessReviews),
	forumposts: many(forumPosts),
}));

export const businessPaymentOptionsRelations = relations(businessPaymentOptions, ({one}) => ({
	business: one(businesses, {
		fields: [businessPaymentOptions.uen],
		references: [businesses.uen]
	}),
}));

export const businessReviewsRelations = relations(businessReviews, ({one}) => ({
	business: one(businesses, {
		fields: [businessReviews.businessUen],
		references: [businesses.uen]
	}),
	user: one(user, {
		fields: [businessReviews.userEmail],
		references: [user.email]
	}),
}));

export const forumpostsRelations = relations(forumPosts, ({one, many}) => ({
	business: one(businesses, {
		fields: [forumPosts.businessUen],
		references: [businesses.uen]
	}),
	user: one(user, {
		fields: [forumPosts.userEmail],
		references: [user.email]
	}),
	forumpostsreplies: many(forumPostsReplies),
}));

export const forumpostsrepliesRelations = relations(forumPostsReplies, ({one}) => ({
	user: one(user, {
		fields: [forumPostsReplies.userEmail],
		references: [user.email]
	}),
	forumpost: one(forumPosts, {
		fields: [forumPostsReplies.postId],
		references: [forumPosts.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));