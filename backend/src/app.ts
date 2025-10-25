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
import { toNodeHandler } from 'better-auth/node';
import auth from './lib/auth.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // allow frontend to pass
    credentials: true,
}));
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

// __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// resolve and serve compiled frontend directory
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// resolve and serve the uploads directory 
// TODO: create azure storage acc and use bucket to store images instead
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// frontend will call and wait for this first before running
app.get('/health', async (req, res) => {
    res.status(200).json({
        "server_status": "ok"
    })
});

//  handler for better auth
app.all('/api/auth/{*any}', toNodeHandler(auth)); // handler for better-auth


app.use(businessRouter)
// app.use(userRouter)

app.use(logger)

export default app