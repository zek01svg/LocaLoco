import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, foreignKey, primaryKey, int, varchar, mysqlEnum, time, text, date, timestamp, tinyint, boolean, unique, decimal, uniqueIndex } from "drizzle-orm/mysql-core"
import { sql, InferSelectModel, InferInsertModel } from "drizzle-orm"
import { timeStamp } from "console";

// put these two tables first to avoid constraint issue
export const businesses = mysqlTable("businesses", {
    ownerID: varchar('owner_id', { length: 255 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
	uen: varchar({ length: 20 }).notNull(),
	businessName: varchar("business_name", { length: 255 }).notNull(),
	businessCategory: varchar("business_category", { length: 100 }),
	description: text(),
	address: varchar({ length: 500 }),
    latitude: decimal({ precision: 9, scale: 6 }),
    longitude: decimal({ precision: 9, scale: 6 }),
	open247: tinyint().default(0),
	email: varchar({ length: 100 }),
	phoneNumber: varchar("phone_number", { length: 20 }),
	websiteLink: varchar("website_link", { length: 255 }),
	socialMediaLink: varchar("social_media_link", { length: 255 }),
	wallpaper: varchar({ length: 255 }),
	dateOfCreation: date("date_of_creation", { mode: 'string' }),
	priceTier: mysqlEnum("price_tier", ['low','medium','high']),
	offersDelivery: tinyint("offers_delivery").default(0),
	offersPickup: tinyint("offers_pickup").default(0),
},
(table) => [
	primaryKey({ columns: [table.uen], name: "businesses_uen"}),
]);

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
  referredByUserID: text("referred_by_user_id")
});

// followed by the other business tables
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

export const forumPosts = mysqlTable('forum_posts', {
    id: int('id').autoincrement().notNull().primaryKey(),
    userEmail: varchar('user_email', { length: 255 }).notNull().references(() => user.email, { onDelete: "cascade" } ),
    uen: varchar('business_uen', { length: 20 }).references(() => businesses.uen, { onDelete: "cascade" } ),
    title: varchar('title', { length: 255 }),
    body: text('body').notNull(),
    likeCount: int('like_count').default(0),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    }, (table) => [
    index('business_uen').on(table.uen),
    index('user_email').on(table.userEmail)
]);

export const forumPostsReplies = mysqlTable('forum_posts_replies', {
    id: int('id').autoincrement().notNull().primaryKey(),
    postId: int('post_id').notNull(), 
    userEmail: varchar('user_email', { length: 255 }).notNull().references(() => user.email, { onDelete: "cascade" } ),
    body: text('body').notNull(),
    likeCount: int('like_count').default(0),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
}, (table) => [
    index('post_id').on(table.postId),
    index('user_id').on(table.userEmail),
    foreignKey({
        columns: [table.postId],
        foreignColumns: [forumPosts.id],
        name: 'replies_post_id_fk',
    }).onDelete('cascade'),
]);

export const businessReviews = mysqlTable('business_reviews', {
    id: int('id').primaryKey().autoincrement(),
    userEmail: varchar('user_email', { length: 255 }).notNull().references(() => user.email, { onDelete: "cascade" } ),
    uen: varchar('business_uen', { length: 20 }).references(() => businesses.uen, { onDelete: "cascade" } ),
    rating: int('rating').notNull(),
    body: text('body').notNull(),
    likeCount: int('like_count').default(0),
    createdAt: timestamp("created_at", { mode: 'string' })
});

export const referrals = mysqlTable("referrals", {
    id: int("ref_id").autoincrement().notNull(),
    referrerUserId: varchar("referrer_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    referredUserId: varchar("referred_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    referralCode: varchar("referral_code", { length: 10 }).notNull(),
    status: mysqlEnum("status", ["claimed","qualified","rewarded","rejected"]).notNull().default("claimed"),
    referredAt: timestamp("referred_at", { mode: 'string' }).defaultNow().notNull(),
    }, (table) => [
    primaryKey({ columns: [table.id], name: "referrals_id" }),
    index("idx_referrer").on(table.referrerUserId),
    index("idx_referred").on(table.referredUserId),
    uniqueIndex("uq_referrer_referred").on(table.referrerUserId, table.referredUserId)
]);

export const vouchers = mysqlTable("vouchers", {
    id: int("voucher_id").autoincrement().notNull(),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    refId: int("ref_id",).references(() => referrals.id, { onDelete: "set null", onUpdate: "cascade" }),
    amount: int("amount").notNull(),
    status: mysqlEnum("status", ["issued", "used", "expired", "revoked"]).notNull().default("issued"),
    issuedAt: timestamp("issued_at", { mode: 'string' }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { mode: 'string' }),
    }, (table) => [
    primaryKey({ columns: [table.id], name: "voucher_id" }),
    index("idx_v_user").on(table.userId),
    index("idx_v_status").on(table.status),
    index("idx_v_expires").on(table.expiresAt),
]);

export const businessAnnouncements = mysqlTable("business_announcements", {
    announcementId: int("announcement_id").autoincrement().notNull(),
    businessUen: varchar("business_uen", { length: 20 }).notNull().references(() => businesses.uen),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
    index("business_uen").on(table.businessUen),
    primaryKey({ columns: [table.announcementId], name: "business_announcements_announcement_id"}),
]);

// lastly, the tables required by better-auth
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