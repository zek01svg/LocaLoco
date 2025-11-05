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
        : 'http://localhost:3000', 
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
        "https://localoco.blob.core.windows.net",
        "https://*.googleapis.com",      // Wildcard for all googleapis subdomains
        "https://*.gstatic.com",          // Wildcard for gstatic subdomains
        "https://maps.googleapis.com",    // Explicit for maps API
        "https://maps.gstatic.com"        // Explicit for map tiles
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://maps.googleapis.com"// Add this
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https://cdn.jsdelivr.net",
        "https://localoco.blob.core.windows.net",
        "https://maps.gstatic.com",
        "https://*.googleapis.com",
        "*.google.com",
        "https://*.ggpht.com",
        "https://images.unsplash.com"
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

// __dirname equivalent in ES module
const frontendPath = path.resolve(__dirname, '../../frontend/dist');

app.use(businessRouter) // router for business functionality
app.use(userRouter) // router for user functionality
app.use(featureRouter) // router for small features
app.use(imageUploadRouter) // router for the images
app.all('/api/auth/{*any}', toNodeHandler(auth)); // handler for better-auth

// static frontend
app.use(express.static(frontendPath));

// landing and react routes
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'landing.html'));
});

app.get('/map', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// catch-all for react router
app.get('{*any}', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

export default app