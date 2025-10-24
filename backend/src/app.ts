import express, { type Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'
import path from 'path'
import logger from './middleware/logger.js';
import { fileURLToPath } from 'url';
import businessRouter from './routes/businessRoutes.js';
import { Hono } from 'hono';
// import userRouter from './routes/userRoutes.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Add Helmet for CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'", 
        "http://localhost:5000",
        "https://cdn.jsdelivr.net"
    ],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
    },
  })
);

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve and serve frontend directory
const frontendPath = path.resolve(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// resolve and serve the uploads directory
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// For SPA routing
app.get('/', async (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(businessRouter)
// app.use(userRouter)

app.use(logger)

export default app