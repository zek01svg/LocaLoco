import { Business, HourEntry, DayOfWeek, BusinessPaymentOption } from "../types/Business.js";
import db from '../database/db.js'

// for drizzle
import { businesses } from '../database/schema.js';
import { businessPaymentOptions } from '../database/schema.js';
import { businessOpeningHours } from '../database/schema.js';
import { and, or, ilike, eq, inArray, gte, sql, asc, desc } from 'drizzle-orm';


// helper interface and type for filtering purposes so that typescript wont complain
type PriceTier = 'low' | 'medium' | 'high';
interface FilterOptions {
    search_query?: string;
    price_tier?: PriceTier | PriceTier[]
    business_category?: string | string[];
    newly_added?: boolean;
    open247?: boolean;
    offers_delivery?: boolean;
    offers_pickup?: boolean;
    payment_options?: string[]; 
    sort_by?: 'business_name' | 'date_of_creation' | 'price_tier';
    sort_order?: 'asc' | 'desc';
}

class BusinessModel {

    /**
     * Retrieves all businesses from the database.
     * 
     * For each business, fetches its payment options and opening hours 
     * (if not open 24/7), then returns a fully populated list of `Business` objects.
     * 
     * @returns {Promise<Business[]>} An array of all businesses with full details.
     */
    public static async getAllBusinesses() {
        // get all the businesses first
        // loop through all the businesses and for each business, fetch the corresponding payment methods and opening hours
        const businessRows = await db.select().from(businesses)
        const container: Business[] = [];

        for (const business of businessRows) {
            
            // fetch the corresponding payment method
            const paymentRows = await db.select().from(businessPaymentOptions).where(eq(businessPaymentOptions.uen, business.uen))
            const paymentOptions = paymentRows.map(p => p.paymentOption)

            const openingHours: Record<DayOfWeek, HourEntry> = {} as Record<DayOfWeek, HourEntry>
            
            // if not open247, get the opening hours
            if (!business.open247) {
                const hourRows = await db.select().from(businessOpeningHours).where(eq(businessOpeningHours.uen, business.uen))
                for (const h of hourRows) {
                    openingHours[h.dayOfWeek as DayOfWeek] = { open: h.openTime, close: h.closeTime }
                }
            }

            // build the business object from scratch to avoid type error
            const fullBusiness: Business = {
                uen: business.uen,
                businessName: business.businessName,
                businessCategory: business.businessCategory!, 
                description: business.description!,
                address: business.address!,
                open247: Boolean(business.open247),
                openingHours,
                email: business.email!,
                phoneNumber: business.phoneNumber!,
                websiteLink: business.websiteLink ?? null,
                socialMediaLink: business.socialMediaLink ?? null,
                wallpaper: business.wallpaper!,
                dateOfCreation: business.dateOfCreation!,
                priceTier: business.priceTier!,
                offersDelivery: Boolean(business.offersDelivery),
                offersPickup: Boolean(business.offersPickup),
                paymentOptions
            }
            // append to the array to be returned
            container.push(fullBusiness)
        }

        return container
    }

    /**
     * Fetches a business record by its UEN (Unique Entity Number).
     * 
     * Retrieves the business details, payment options, and opening hours 
     * (if not open 24/7). Returns `null` if no business is found.
     * 
     * @param {string} uen - The business’s Unique Entity Number.
     * @returns {Promise<Business | null>} The full `Business` object or `null` if not found.
     */
    public static async getBusinessByUEN(uen:string):Promise<Business | null> {
        
        const businessRow = await db.select().from(businesses).where(eq(businesses.uen,uen))

        // if none found return null immediately to avoid type error
        if (businessRow.length === 0) {
            return null
        }
        
        const business = businessRow[0] as Business
        const paymentRow = await db.select().from(businessPaymentOptions).where(eq(businessPaymentOptions.uen,uen))
        
        const paymentOptions = paymentRow.map(p => p.paymentOption)

        const openingHours: Record<DayOfWeek, HourEntry> = {} as Record<DayOfWeek, HourEntry>
            
        // if not open247, get the opening hours
        if (!business.open247) {
            const hourRows = await db.select().from(businessOpeningHours).where(eq(businessOpeningHours.uen, business.uen))
            for (const h of hourRows) {
                openingHours[h.dayOfWeek as DayOfWeek] = { open: h.openTime, close: h.closeTime }
            }
        } 

        const fullBusiness:Business = {
            uen: business.uen,
            businessName: business.businessName,
            businessCategory: business.businessCategory!, 
            description: business.description!,
            address: business.address!,
            open247: Boolean(business.open247),
            openingHours,
            email: business.email!,
            phoneNumber: business.phoneNumber!,
            websiteLink: business.websiteLink ?? null,
            socialMediaLink: business.socialMediaLink ?? null,
            wallpaper: business.wallpaper!,
            dateOfCreation: business.dateOfCreation!,
            priceTier: business.priceTier!,
            offersDelivery: Boolean(business.offersDelivery),
            offersPickup: Boolean(business.offersPickup),
            paymentOptions
        }

        return fullBusiness      
    }

    /**
     * Retrieves a list of businesses from the database that match the provided filter criteria.
     * Supports searching by name/description, filtering by price tier, category, 
     * payment options, opening hours, and newly added businesses. Results can also be sorted.
     * 
     * @param filters - Object containing filtering and sorting options.
     * @returns An array of businesses matching the filters with full details.
     */
    public static async getFilteredBusinesses(filters: FilterOptions): Promise<Business[]> {
        const conditions: any[] = [];

        // Search query - case insensitive search
        if (filters.search_query) {
            const searchPattern = `%${filters.search_query}%`;
            conditions.push(
                or(
                    ilike(businesses.businessName, searchPattern),
                    ilike(businesses.description, searchPattern)
                )
            );
        }

        // Price tier - multi-select support
        if (filters.price_tier) {
            if (Array.isArray(filters.price_tier) && filters.price_tier.length > 0) {
                conditions.push(inArray(businesses.priceTier, filters.price_tier));
            } else if (typeof filters.price_tier === 'string') {
                conditions.push(eq(businesses.priceTier, filters.price_tier));
            }
        }

        // Business category - multi-select support
        if (filters.business_category) {
            if (Array.isArray(filters.business_category) && filters.business_category.length > 0) {
                conditions.push(inArray(businesses.businessCategory, filters.business_category));
            } else if (typeof filters.business_category === 'string') {
                conditions.push(eq(businesses.businessCategory, filters.business_category));
            }
        }

        // Newly added (last 7 days)
        if (filters.newly_added) {
            conditions.push(
                gte(businesses.dateOfCreation, sql`DATE_SUB(CURDATE(), INTERVAL 7 DAY)`)
            );
        }

        // Boolean filters
        if (filters.open247) {
            conditions.push(eq(businesses.open247, 1));
        }
        if (filters.offers_delivery) {
            conditions.push(eq(businesses.offersDelivery, 1));
        }
        if (filters.offers_pickup) {
            conditions.push(eq(businesses.offersPickup, 1));
        }

        // Payment options filter - business must have ALL selected options
        if (filters.payment_options && filters.payment_options.length > 0) {
            // Subquery to find UENs that have all the required payment options
            const requiredCount = filters.payment_options.length;
            conditions.push(
                sql`${businesses.uen} IN (
                    SELECT uen 
                    FROM ${businessPaymentOptions}
                    WHERE ${inArray(businessPaymentOptions.paymentOption, filters.payment_options)}
                    GROUP BY uen
                    HAVING COUNT(DISTINCT ${businessPaymentOptions.paymentOption}) = ${requiredCount}
                )`
            );
        }

        try {
            // Build main query with all conditions
            let query = db
                .select()
                .from(businesses)
                .$dynamic();

            if (conditions.length > 0) {
                query = query.where(and(...conditions));
            }

            // Apply sorting
            const sortDirection = filters.sort_order === 'asc' ? asc : desc;
            switch (filters.sort_by) {
                case 'business_name':
                    query = query.orderBy(sortDirection(businesses.businessName));
                    break;
                case 'price_tier':
                    query = query.orderBy(sortDirection(businesses.priceTier));
                    break;
                case 'date_of_creation':
                default:
                    query = query.orderBy(sortDirection(businesses.dateOfCreation));
                    break;
            }

            // Execute main query
            const businessRows = await query;

            if (businessRows.length === 0) {
                return [];
            }

            // Batch fetch payment options for all businesses (1 query instead of N)
            const allUens = businessRows.map(b => b.uen);
            const allPaymentOptions = await db
                .select()
                .from(businessPaymentOptions)
                .where(inArray(businessPaymentOptions.uen, allUens));

            // Batch fetch opening hours for non-24/7 businesses (1 query instead of N)
            const nonOpen247Uens = businessRows
                .filter(b => !b.open247)
                .map(b => b.uen);
            
            const allOpeningHours = nonOpen247Uens.length > 0
                ? await db
                    .select()
                    .from(businessOpeningHours)
                    .where(inArray(businessOpeningHours.uen, nonOpen247Uens))
                : [];

            // Create lookup maps for O(1) access
            const paymentOptionsMap = new Map<string, string[]>();
            for (const payment of allPaymentOptions) {
                if (!paymentOptionsMap.has(payment.uen)) {
                    paymentOptionsMap.set(payment.uen, []);
                }
                paymentOptionsMap.get(payment.uen)!.push(payment.paymentOption);
            }

            const openingHoursMap = new Map<string, Record<DayOfWeek, HourEntry>>();
            for (const hour of allOpeningHours) {
                if (!openingHoursMap.has(hour.uen)) {
                    openingHoursMap.set(hour.uen, {} as Record<DayOfWeek, HourEntry>);
                }
                openingHoursMap.get(hour.uen)![hour.dayOfWeek as DayOfWeek] = {
                    open: hour.openTime,
                    close: hour.closeTime
                };
            }

            // Map to Business objects
            const fullBusinesses: Business[] = businessRows.map(business => ({
                uen: business.uen,
                businessName: business.businessName,
                businessCategory: business.businessCategory!,
                description: business.description!,
                address: business.address!,
                open247: Boolean(business.open247),
                openingHours: openingHoursMap.get(business.uen) || ({} as Record<DayOfWeek, HourEntry>),
                email: business.email!,
                phoneNumber: business.phoneNumber!,
                websiteLink: business.websiteLink ?? null,
                socialMediaLink: business.socialMediaLink ?? null,
                wallpaper: business.wallpaper!,
                dateOfCreation: business.dateOfCreation!,
                priceTier: business.priceTier!,
                offersDelivery: Boolean(business.offersDelivery),
                offersPickup: Boolean(business.offersPickup),
                paymentOptions: paymentOptionsMap.get(business.uen) || []
            }));

            return fullBusinesses;

        } catch (error) {
            console.error("Error filtering and searching businesses:", error);
            return [];
        }
    }

    /**
     * Registers a new business in the database.
     * 
     * Inserts a new record into the `businesses` table, followed by its associated 
     * payment options and opening hours (if not open 24/7). 
     * 
     * Each business is identified by a unique UEN. 
     * 
     * @param {Business} business - The `Business` object containing all required fields.
     * @returns {Promise<void>} Resolves when the business and its related data are successfully inserted.
     */
    public static async registerBusiness (business:Business) {

        try {
            //insert into businesses
            await db.insert(businesses).values({
                uen: business.uen,
                businessName: business.businessName,
                businessCategory: business.businessCategory,
                description: business.description,
                address: business.address,
                open247: business.open247,
                email: business.email,
                phoneNumber: business.phoneNumber,
                websiteLink: business.websiteLink,
                socialMediaLink: business.socialMediaLink, 
                wallpaper: business.wallpaper,
                dateOfCreation: business.dateOfCreation, 
                priceTier: business.priceTier,
                offersDelivery: business.offersDelivery,
                offersPickup: business.offersPickup,
            } as typeof businesses.$inferInsert)

            // loop through the payment options and insert
            if (business.paymentOptions?.length) {
                await Promise.all(
                    business.paymentOptions.map(option =>
                        db.insert(businessPaymentOptions).values({
                            uen: business.uen,
                            paymentOption: option
                        } as typeof businessPaymentOptions.$inferInsert)
                    )
                );
            }

            // if business isnt 24/7, loop through the opening hrs and insert
            if (!business.open247) {
                const openingHourEntries = Object.entries(business.openingHours) as [DayOfWeek, HourEntry][];
                await Promise.all(
                    openingHourEntries.map(([day, hours]) =>
                        db.insert(businessOpeningHours).values({
                            uen: business.uen,
                            dayOfWeek: day,
                            openTime: hours.open,
                            closeTime: hours.close
                        } as typeof businessOpeningHours.$inferInsert)
                    )
                );
            }
        }
        catch (err:any) {
            console.error('--- DETAILED DATABASE ERROR ---');
            console.error(`Error Code: ${err.code}`);         // e.g., ER_DUP_ENTRY
            console.error(`Error Number: ${err.errno}`);     // e.g., 1062
            console.error(`SQL Message: ${err.sqlMessage}`); // The full MySQL error
            console.error('Full Error Object:', err);
            console.error('---------------------------------');
        }
    }


    
}

export default BusinessModel