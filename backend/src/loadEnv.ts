import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point this to your .env file
const envPath = path.resolve(__dirname, `../../.env`); 
dotenv.config({ path: envPath });