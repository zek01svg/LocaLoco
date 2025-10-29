import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, foreignKey, primaryKey, int, varchar, mysqlEnum, time, text, date, timestamp, tinyint, boolean, unique } from "drizzle-orm/mysql-core"
import { sql, InferSelectModel, InferInsertModel } from "drizzle-orm"

export const businessOpeningHours = mysqlTable("business_opening_hours", {
	id: int().autoincrement().notNull(),
	uen: varchar({ length: 20 }).notNull().references(() => businesses.uen, { onDelete: "cascade" } ),
	dayOfWeek: mysqlEnum("day_of_week", ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']).notNull(),
	openTime: time("open_time").notNull(),
	closeTime: time("close_time").notNull(),
},
(table) => [
	index("uen").on(table.uen),
	primaryKey({ columns: [table.id], name: "business_opening_hours_id"}),
]);

export const businessPaymentOptions = mysqlTable("business_payment_options", {
	id: int().autoincrement().notNull(),
	uen: varchar({ length: 20 }).notNull().references(() => businesses.uen, { onDelete: "cascade" } ),
	paymentOption: varchar("payment_option", { length: 50 }).notNull(),
},
(table) => [
	index("uen").on(table.uen),
	primaryKey({ columns: [table.id], name: "business_payment_options_id"}),
]);

export const businesses = mysqlTable("businesses", {
	uen: varchar({ length: 20 }).notNull(),
	businessName: varchar("business_name", { length: 255 }).notNull(),
	businessCategory: varchar("business_category", { length: 100 }),
	description: text(),
	address: varchar({ length: 500 }),
	open247: tinyint().default(0),
	email: varchar({ length: 100 }),
	phoneNumber: varchar("phone_number", { length: 20 }),
	websiteLink: varchar("website_link", { length: 255 }),
	socialMediaLink: varchar("social_media_link", { length: 255 }),
	wallpaper: varchar({ length: 255 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateOfCreation: date("date_of_creation", { mode: 'string' }),
	priceTier: mysqlEnum("price_tier", ['low','medium','high']),
	offersDelivery: tinyint("offers_delivery").default(0),
	offersPickup: tinyint("offers_pickup").default(0),
},
(table) => [
	primaryKey({ columns: [table.uen], name: "businesses_uen"}),
]);

export const forumPosts = mysqlTable('forum_posts', {
    id: int('id').autoincrement().notNull().primaryKey(),
    userEmail: varchar('user_email', { length: 255 }).notNull().references(() => user.email),
    businessUen: varchar('business_uen', { length: 20 }).references(() => businesses.uen),
    title: varchar('title', { length: 255 }),
    body: text('body').notNull(),
    likeCount: int('like_count').default(0),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    }, (table) => [
    index('business_uen').on(table.businessUen),
    index('user_email').on(table.userEmail)
]);

export const forumPostsReplies = mysqlTable('forum_posts_replies', {
    id: int('id').autoincrement().notNull().primaryKey(),
    postId: int('post_id').notNull(), 
    userEmail: varchar('user_email', { length: 255 }).notNull().references(() => user.email),
    body: text('body').notNull(),
    likeCount: int('like_count').default(0),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
}, (table) => [
    index('post_id').on(table.postId),
    index('user_email').on(table.userEmail),
    foreignKey({
        columns: [table.postId],
        foreignColumns: [forumPosts.id],
        name: 'replies_post_id_fk',
    }).onDelete('cascade'),
]);

export const businessReviews = mysqlTable('business_reviews', {
    id: int('id').primaryKey().autoincrement(),
    userEmail: varchar('user_email', { length: 255 }).notNull().references(() => user.email),
    businessUen: varchar('business_uen', { length: 20 }).references(() => businesses.uen),
    rating: int('rating').notNull(),
    body: text('body').notNull(),
    likeCount: int('like_count').default(0),
    createdAt: timestamp("created_at", { mode: 'string' })
});

export const referrals = mysqlTable("referrals", {
    id: int().autoincrement().notNull(),
    referrerUserId: varchar("referrer_user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
    referredUserId: varchar("referred_user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => [
    index("referred_user_idx").on(table.referredUserId),
    index("referrer_user_idx").on(table.referrerUserId),
    primaryKey({ columns: [table.id], name: "referrals_id"}),
]);

export const vouchers = mysqlTable("vouchers", {
    id: int().autoincrement().notNull(),
    referrerUserId: varchar("referrer_user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
    referredUserId: varchar("referred_user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
    referralCode: varchar("referral_code", { length: 10 }).notNull(),
    amount: int().notNull(),
    status: mysqlEnum(['issued','redeemed','expired']).default('issued'),
    issuedAt: timestamp("issued_at", { mode: 'string' }).defaultNow(),
    redeemedAt: timestamp("redeemed_at", { mode: 'string' }),
},
(table) => [
    index("referred_user_idx").on(table.referredUserId),
    index("referrer_user_idx").on(table.referrerUserId),
    primaryKey({ columns: [table.id], name: "vouchers_id"}),
    unique("referral_code").on(table.referralCode),
]);

// THIS BLOCK ONWARDS IS FOR BETTER-AUTH TABLES ONLY

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  hasBusiness: boolean("has_business"),
  referralCode: text("referral_code"),
  referredByUserID: text("referred_by_user_id"),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Business = InferSelectModel<typeof businesses>;
export type BusinessPaymentOption = InferSelectModel<typeof businessPaymentOptions>;
export type BusinessOpeningHour = InferSelectModel<typeof businessOpeningHours>;
export type NewBusiness = InferInsertModel<typeof businesses>;