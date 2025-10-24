import { relations } from "drizzle-orm/relations";
import { businesses, businessOpeningHours, businessPaymentOptions } from "./schema.js";

export const businessOpeningHoursRelations = relations(businessOpeningHours, ({one}) => ({
	business: one(businesses, {
		fields: [businessOpeningHours.uen],
		references: [businesses.uen]
	}),
}));

export const businessesRelations = relations(businesses, ({many}) => ({
	businessOpeningHours: many(businessOpeningHours),
	businessPaymentOptions: many(businessPaymentOptions),
}));

export const businessPaymentOptionsRelations = relations(businessPaymentOptions, ({one}) => ({
	business: one(businesses, {
		fields: [businessPaymentOptions.uen],
		references: [businesses.uen]
	}),
}));