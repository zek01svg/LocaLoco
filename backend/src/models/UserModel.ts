import { User } from '../types/User.js';
import db from '../database/db.js'
import { user } from '../database/auth-schema.js';
import { and, or, ilike, eq, inArray, gte, sql, asc, desc } from 'drizzle-orm';

class UserModel {
    
}

export default UserModel