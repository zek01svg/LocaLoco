import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan'
import businessRouter from './routes/businessRoutes.js';
import imageUploadRouter from './routes/uploadRoutes.js';
import featureRouter from './routes/featureRoutes.js'
import userRouter from './routes/userRoutes.js';
import { toNodeHandler } from 'better-auth/node';
import auth from './lib/auth.js'; 

const app: Application = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://localoco.azurewebsites.net'
        : 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))


// Add Helmet for CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "http://localhost:3000",
        "http://localhost:5000",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://localoco.blob.core.windows.net"
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
      imgSrc: [
        "'self'", 
        "data:", 
        "https://cdn.jsdelivr.net",
        "https://localoco.blob.core.windows.net"
    ],
      fontSrc: [
        "'self'", 
        "data:", 
        "https://fonts.gstatic.com"
    ],
    },
  })
);

// __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// resolve and serve compiled frontend directory
const frontendPath = path.resolve(__dirname, '../../frontend2/dist');
app.use(express.static(frontendPath));

// frontend will call and wait for this first before running
app.get('/health', async (req, res) => {
    res.status(200).json({
        "server_status": "ok"
    })
});

app.use(businessRouter) // router for business functionality
app.use(userRouter) // router for user functionality
app.use(featureRouter) // router for small features
app.use(imageUploadRouter) // router for the images
app.all('/api/auth/{*any}', toNodeHandler(auth)); // handler for better-auth

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
});

export default app