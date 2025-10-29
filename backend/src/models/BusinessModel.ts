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
     * Registers a new business, inserting data into three tables within a transaction.
     * Note: HASHES the password before insertion.
     */
    //  public static async registerBusiness(
    //      business: Omit<Business, 'password' | 'open247' | 'offersDelivery' | 'offersPickup' | 'dateOfCreation'> & {
    //          password: string, 
    //          open247: boolean, 
    //          offersDelivery: boolean, 
    //          offersPickup: boolean,
    //          dateOfCreation: string // Passed as a string (YYYY-MM-DD)
    //      }
    //  ): Promise<boolean> {
    //      const {
    //          uen, password, businessName, businessCategory, description, address, open247,
    //          openingHours, email, phoneNumber, websiteLink, socialMediaLink, wallpaper,
    //          dateOfCreation, priceTier, offersDelivery, offersPickup, paymentOptions
    //      } = business;

    //      try {
    //          const hashedPassword = await argon2.hash(password);

    //          await db.beginTransaction();

    //         //   1. Insert into the businesses table
    //          const sql = `
    //              INSERT INTO businesses (
    //                  uen, password, business_name, business_category, description, address, open247,
    //                  email, phone_number, website_link, social_media_link, wallpaper,
    //                  date_of_creation, price_tier, offers_delivery, offers_pickup
    //              ) VALUES (
    //                  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    //              )`;

    //          const [result] = await db.execute<ResultSetHeader>(sql, [
    //              uen, hashedPassword, businessName, businessCategory, description, address, open247,
    //              email, phoneNumber, websiteLink, socialMediaLink, wallpaper,
    //              dateOfCreation, priceTier, offersDelivery, offersPickup
    //          ]);

    //          if (result.affectedRows === 0) {
    //              throw new Error("Failed to insert main business record.");
    //          }

    //         //   2. Insert payment options
    //          if (paymentOptions.length > 0) {
    //              const sqlPayment = `INSERT INTO business_payment_options (uen, payment_option) VALUES (?, ?)`;
    //              for (const option of paymentOptions) {
    //                  await db.execute<ResultSetHeader>(sqlPayment, [uen, option]);
    //              }
    //          }

    //         //   3. Insert opening hours (if not open 24/7)
    //          if (!open247) {
    //              const sqlHours = `INSERT INTO business_opening_hours (uen, day_of_week, open_time, close_time) VALUES (?, ?, ?, ?)`;
    //              for (const day in openingHours) {
    //                  const times = openingHours[day as DayOfWeek];
    //                   PHP's ucfirst(strtolower($day)) logic is used to match DB's capitalization if needed
    //                  const formattedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    //                  await db.execute<ResultSetHeader>(sqlHours, [uen, formattedDay, times.open, times.close]);
    //              }
    //          }

    //          await db.commit();
    //          return true;

    //      } catch (error) {
    //          console.error("Error registering business:", error);
    //          await db.rollback();
    //          return false;
    //      }
    //  }


    /**
     * Updates the core details of a business in the 'businesses' table.
     * Note: Includes password hashing.
     */
    // public static async updateCoreDetails(
    //     uen: string, 
    //     details: {
    //         password: string, 
    //         businessName: string, 
    //         businessCategory: string, 
    //         description: string, 
    //         address: string,
    //         open247: boolean, 
    //         email: string, 
    //         phoneNumber: string, 
    //         websiteLink: string | null, 
    //         socialMediaLink: string | null, 
    //         wallpaper: string | null,
    //         dateOfCreation: string, 
    //         priceTier: string, 
    //         offersDelivery: boolean, 
    //         offersPickup: boolean
    //     }
    // ): Promise<boolean> {
    //     try {
    //         const hashedPassword = await argon2.hash(details.password);
            
    //         const sql = `
    //             UPDATE businesses SET
    //                 password = ?, business_name = ?, business_category = ?, description = ?, address = ?, 
    //                 open247 = ?, email = ?, phone_number = ?, website_link = ?, social_media_link = ?, 
    //                 wallpaper = ?, date_of_creation = ?, price_tier = ?, offers_delivery = ?, offers_pickup = ?
    //             WHERE uen = ?`;
            
    //         const params = [
    //             hashedPassword, details.businessName, details.businessCategory, details.description, details.address,
    //             details.open247, details.email, details.phoneNumber, details.websiteLink, details.socialMediaLink,
    //             details.wallpaper, details.dateOfCreation, details.priceTier, details.offersDelivery, details.offersPickup, uen
    //         ];

    //         const [result] = await db.execute<ResultSetHeader>(sql, params);
            
    //         if (result.affectedRows === 0) {
    //             console.error(`Business with UEN ${uen} not found for core update.`);
    //             return false;
    //         }

    //         return true;
    //     } catch (error) {
    //         console.error("Error updating core business details:", error);
    //         return false;
    //     }
    // }

    // /**
    //  * Replaces all payment options for a business.
    //  */
    // public static async updatePaymentOptions(uen: string, paymentOptions: string[]): Promise<boolean> {
    //     try {
    //         await db.beginTransaction();

    //         // 1. Delete existing options
    //         await db.execute('DELETE FROM business_payment_options WHERE uen = ?', [uen]);

    //         // 2. Insert new options
    //         if (paymentOptions.length > 0) {
    //             const insertSql = 'INSERT INTO business_payment_options (uen, payment_option) VALUES (?, ?)';
    //             for (const option of paymentOptions) {
    //                 await db.execute<ResultSetHeader>(insertSql, [uen, option]);
    //             }
    //         }

    //         await db.commit();
    //         return true;
    //     } catch (error) {
    //         console.error("Error updating payment options:", error);
    //         await db.rollback();
    //         return false;
    //     }
    // }

    // /**
    //  * Replaces all opening hours for a business. 
    //  * Note: It deletes all hours, then inserts new ones only if open247 is false.
    //  */
    // public static async updateOpeningHours(
    //     uen: string, 
    //     open247: boolean, 
    //     openingHours: Record<DayOfWeek, HourEntry>
    // ): Promise<boolean> {
    //     try {
    //         await db.beginTransaction();

    //         // 1. Delete all existing hours
    //         await db.execute('DELETE FROM business_opening_hours WHERE uen = ?', [uen]);

    //         // 2. Insert new hours only if not 24/7
    //         if (!open247) {
    //             const insertHours = `INSERT INTO business_opening_hours (uen, day_of_week, open_time, close_time) VALUES (?, ?, ?, ?)`;
                
    //             for (const day in openingHours) {
    //                 const times = openingHours[day as DayOfWeek];
    //                 // Match DB's capitalization (e.g., 'Monday')
    //                 const formattedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    //                 await db.execute<ResultSetHeader>(insertHours, [uen, formattedDay, times.open, times.close]);
    //             }
    //         }

    //         // Note: The 'open247' flag in the main 'businesses' table must be updated separately 
    //         // using `updateCoreDetails` to reflect this change correctly.

    //         await db.commit();
    //         return true;
    //     } catch (error) {
    //         console.error("Error updating opening hours:", error);
    //         await db.rollback();
    //         return false;
    //     }
    // }
    
    // /**
    //  * Deletes a business and all its dependent records within a transaction.
    //  */
    // public static async deleteBusiness(uen: string): Promise<boolean> {
    //     try {
    //         await db.beginTransaction();

    //         // Delete dependent records first (ensures foreign key constraints are met)
    //         await db.execute('DELETE FROM business_opening_hours WHERE uen = ?', [uen]); 
    //         await db.execute('DELETE FROM business_payment_options WHERE uen = ?', [uen]);

    //         // Delete main business record
    //         const [result] = await db.execute<ResultSetHeader>('DELETE FROM businesses WHERE uen = ?', [uen]);
            
    //         if (result.affectedRows === 0) {
    //             await db.rollback();
    //             return false; // Business not found
    //         }

    //         await db.commit();
    //         return true;
    //     } catch (error) {
    //         console.error("Error deleting business:", error);
    //         await db.rollback();
    //         return false;
    //     }
    // }


    
}

export default BusinessModel