import { relations } from "drizzle-orm/relations";
import { user, account, businesses, businessOpeningHours, businessPaymentOptions, forumPosts, session } from "./schema.js";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	forumPosts: many(forumPosts),
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
	forumPosts: many(forumPosts),
}));

export const businessPaymentOptionsRelations = relations(businessPaymentOptions, ({one}) => ({
	business: one(businesses, {
		fields: [businessPaymentOptions.uen],
		references: [businesses.uen]
	}),
}));

export const forumPostsRelations = relations(forumPosts, ({one, many}) => ({
	user: one(user, {
		fields: [forumPosts.userEmail],
		references: [user.email]
	}),
	business: one(businesses, {
		fields: [forumPosts.businessUen],
		references: [businesses.uen]
	}),
	forumPost: one(forumPosts, {
		fields: [forumPosts.parentId],
		references: [forumPosts.id],
		relationName: "forumPosts_parentId_forumPosts_id"
	}),
	forumPosts: many(forumPosts, {
		relationName: "forumPosts_parentId_forumPosts_id"
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));