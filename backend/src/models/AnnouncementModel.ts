import { Announcement, UpdatedAnnouncement } from '../types/Announcement.js';
import db from '../database/db.js'
import { businessAnnouncements } from '../database/schema.js';
import { eq } from 'drizzle-orm';
import { error } from 'console';

// export interface Announcement {
//     announcementId: number,
//     businessUen: string,
//     title: string,
//     content: string,
//     imageURL: string,
//     createdAt:string,
//     updatedAt:string
// }

// announcementId: int("announcement_id").autoincrement().notNull(),
// businessUen: varchar("business_uen", { length: 20 }).notNull().references(() => businesses.uen),
// title: varchar({ length: 255 }).notNull(),
// content: text().notNull(),
// imageUrl: varchar("image_url", { length: 500 }),
// createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
// updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),

class AnnouncementModel {
    
    public static async newAnnouncement (announcement:Omit<Announcement, 'updatedAt' | 'announcementId'>):Promise<void> {
        try  {
            await db.insert(businessAnnouncements).values({
                businessUen: announcement.businessUen,
                title: announcement.title,
                content: announcement.content,
                imageUrl: announcement.imageUrl,
                createdAt: announcement.createdAt,
            })
        } 
        catch (err:any){
            console.error(`Error adding new announcement: ${err}`)
        }
    } 

    public static async getAllAnnouncements (){
        try  {
            const announcements = await db.select().from(businessAnnouncements)
            return announcements
        } 
        catch (err:any){
            console.error(`Error getting announcements: ${err}`)
        }
    } 

    public static async getAnnouncementsByUEN (businessUen:string){
        try  {
            const announcements = await db.select().from(businessAnnouncements).where(eq(businessAnnouncements.businessUen, businessUen))
            return announcements
        } 
        catch (err:any){
            console.error(`Error getting announcements: ${err}`)
        }
    } 

    public static async updateAnnouncement (announcementId:number, UpdatedAnnouncement:Omit<UpdatedAnnouncement, 'updatedAt'>) {
        try  {
            await db.update(businessAnnouncements).set(UpdatedAnnouncement).where(eq(businessAnnouncements.announcementId, announcementId))
        } 
        catch (err:any){
            console.error(`Error updating announcements: ${err}`)
        }
    } 

    public static async deleteAnnouncement (announcementId:number) {
        try  {
            await db.delete(businessAnnouncements).where(eq(businessAnnouncements.announcementId, announcementId))
        } 
        catch (err:any){
            console.error(`Error deleting announcement: ${err}`)
        }
    } 
}

export default AnnouncementModel