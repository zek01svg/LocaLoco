# 🏫 IS216 Web Application Development II Final Project

---
## G10 Group 3  

---

## Group Members

| Name | Role & Contributions |
|------|------------------------|
| **Suan Loong** | Frontend Developer: UI responsiveness, navigation bar, styling & animation, advanced search overlay |
| **Jolene** | Frontend Developer: Business card & details components, explore page, bookmark UX, UI polish |
| **Pamika** | Frontend Developer: Google Maps & API + postal code -> address conversion |
| **Lin Hui** | Frontend Developer: Referral code UI |
| **Charles** | Backend Developer |
---

## Business Problem

> Small local businesses struggle to maintain an online presence, limiting visibility to customers. Local users also struggle to discover and trust nearby independent businesses because key information is scattered and inconsistent.
> Our web application provides a one-stop-for-all platform for users to support and explore different local businesses, and for local entrepreneurs to reach more customers and grow their presence.

Github URL: https://github.com/jolenechia2024/LocaLoco.git<br>
Deployed application URL: https://localoco-wad-ii.azurewebsites.net

---

## Web Solution Overview

### 🎯 Intended Users
- Users looking for nearby local/independent shops/small businesses to support
- Independent, local businesses that need discovery and have troubles reaching customers

### 💡 What Users Can Do & Benefits

| **Feature** | **Description** | **User Benefit** |
|--------------|-----------------|------------------|
| **Interactive Map View (Google Maps API)** | Displays nearby local businesses as map pins, showing their distance from the user. Users can tap to view store details or get directions. | Enables effortless discovery of nearby shops and cafes, making it easy to explore and support local businesses. |
| **Search & Filter Function** | Allows users to search for specific businesses or filter by category (e.g., food, fashion, services, price). | Saves time by helping users quickly find exactly what they’re looking for based on their interests. |
| **Vendor Profiles / Storefronts** | Each business has a dedicated page showing its description, photos, contact info, operating hours, and embedded map location. | Provides shoppers with essential information at a glance and helps businesses present their brand professionally. |
| **Announcements Popup** | Displays the latest events, promotions, or new openings from local businesses. | Keeps users updated on current happenings and encourages them to visit or participate in local events. |
| **Reviews & Ratings** | Users can rate and review businesses they’ve visited, and view feedback from others. | Builds trust and helps users make informed choices while giving businesses valuable feedback. |
| **Community Forum** | A space for users to discuss and share experiences or recommendations about local businesses. | Fosters a sense of community and promotes engagement among local shoppers and merchants. |
| **Vendor Onboarding & Verification** | Businesses can sign up, and manage multiple listings if they own more than one outlet. | Gives small vendors a reliable way to publicize themselves. |
| **Referral & Rewards System** | Each new user receives a unique referral code upon signup. When friends register using the code, both parties earn a SGD5 voucher. If a referral code is used more than five times, the reward increases to $10. | Encourages user and platform growth through word-of-mouth while rewarding loyal users for promoting the platform. |
| **Profile Page (User)** | Displays user details, reviews, loyalty points, and vouchers.| Allows users to track their activity, manage their rewards, and personalize their experience. |
| **Profile Page (Business)** | Displays business details and lets businesses update their details such as opening hours . | Empowers business owners to easily manage and refresh their listings, keeping customers informed and improving visibility through up-to-date, accurate information.<here>
| **Announcements Popup (Explore Tab)** | When users tap on the *Explore* tab, a popup highlights current announcements such as promotions, new store openings, or community events. | Instantly informs users about the latest local happenings without needing to search manually, encouraging timely visits and engagement. |

---

## Tech Stack

This project is built with a modern full-stack TypeScript ecosystem — ensuring scalability, maintainability, and a smooth developer experience.

### 🧠 Project-wide Technologies

|  | Technology | Purpose / Usage |
|:--:|:--|:--|
| 🖥️ | **TypeScript** | Adds static typing and IDE support to JavaScript, catching errors early and improving maintainability across the entire codebase. |
| ☁️ | **GitHub + Azure** | Handles source control (GitHub) and automated deployment pipelines (Azure) for continuous integration and delivery (CI/CD). |

### 🎨 Frontend Technologies

|  | Technology | Purpose / Usage |
|:--:|:--|:--|
| 🖥️ | **React.js** | Frontend framework for building a responsive, interactive UI with reusable and strongly typed components. |
| 🎨 | **Tailwind CSS** | Utility-first CSS framework that enables rapid UI development with responsive and consistent styling. |
| 🗺️ | **Google Maps JavaScript API** | Embeds interactive maps, markers, and routes. Also handles geocoding (address → coordinates) and directions visualization. |
| 📍 | **OneMap API (Singapore)** | Retrieves formatted Singapore addresses from postal codes, then integrates with Google Maps API to generate latitude/longitude for location mapping. |

### ⚙️ Backend Technologies

|  | Technology | Purpose / Usage |
|:--:|:--|:--|
| ⚙️ | **Node.js + Express.js** | Backend runtime and framework for handling APIs, authentication, and server-side logic efficiently. Migrated from PHP for scalability and modern tooling. |
| 🗄️ | **Drizzle ORM + MySQL** | Simplifies database interactions using a type-safe ORM (Drizzle) with MySQL as the relational database. Ensures schema consistency and type safety. |
| ☁️ | **Better Auth** | Provides secure, modern authentication and session management with built-in support for OAuth, JWTs, and passwordless login. |

---

## Developers Setup Guide

Comprehensive steps to help other developers or evaluators run and test LocaLoco.

---

### 1) Prerequisites
- [Git](https://git-scm.com/) v2.4+  
- [Node.js](https://nodejs.org/) v22+ and npm v9+  
- WAMP/MAMP server
- MySQL Workbench

---

### 2) Download the Project
```bash
git clone https://github.com/<org-or-user>/LocaLoco.git
npm install # install root dependencies 
npx concurrently "cd backend && npm install" "cd frontend && npm install" # install both frontend and backend dependencies
```

---

### 3) Database Setup

#### MySQL Database
1. **Start WAMP/MAMP and MySQL Server**
   - Make sure your MySQL server is running on `localhost:3306`
   
2. **Create Database**
    Using MySQL Workbench, run the first three uncommented lines of the SQL script that which is located in /backend/src/database.

3. **Create Tables**
   Inside your chosen IDE (e.g., VSCode)
   ```bash
   cd backend && npm run db:migrate
   ```

4. **Verify Database**

    Inside MySQL Workbench, run 
    ```bash
    show tables;
    ```
   and check whether the following tables exist: `user`, `businesses`, `referrals`, `vouchers`, `session`, etc.
5. **Insert Dummy Data**
   Inside MySQL Workbench, run all the remaining lines that haven't been executed

---

### 4) Run the Application Built for Production

#### 
In the root directory of the application, run:
```bash
npm start
```

---

### 5) Testing the Application

#### Key Features to Test

| Feature | Test Description | Expected Outcome |
|:--|:--|:--|
| **Authentication** | Sign up, login, logout | User session persists, redirects to map page |
| **Referral System** | Sign up with referral code | Popup appears, voucher issued, referral count updates |
| **Profile Page** | View profile, referral panel, vouchers | Stats displayed correctly (vouchers, referrals) |
| **Vouchers** | Check "My Vouchers" tab | User's redeemed vouchers from referrals shown |
| **Business CRUD** | Add, edit, delete business | Database updates, UI reflects changes |
| **Map View** | Browse businesses on map | Markers display, clicking shows business details |
| **Logout** | Click logout button | User logged out, redirected to welcome page |

---

### 6) Project Structure

```
LocaLoco/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API request handlers (handle logic for each route)
│   │   ├── models/           # Database models (handles database directly)
│   │   ├── routes/           # Defines and groups API endpoints
│   │   ├── database/         # DB connection setup & schema initialization
│   │   ├── types/            # TypeScript interfaces & types shared across backend
│   │   ├── lib/              # Utility functions, middleware, auth helpers, etc.
│   │   ├── drizzle/          # Drizzle ORM migration script
│   │   ├── app.ts            # Express app configuration 
│   │   ├── loadEnv.ts        # Helper for loading environment variables safely
│   │   └── index.ts          # Main server entry point 
│   ├── drizzle.config.ts     # Drizzle ORM configuration file
│   ├── package.json          # Backend dependencies & scripts
│   └── tsconfig.json         # TypeScript compiler config for backend
│
├── frontend/
│   ├── components/           # Reusable React UI components
│   ├── constants/            # App-wide constants 
│   ├── data/                 # Static data 
│   ├── styles/               # Global styles, theme definitions, CSS modules
│   ├── hooks/                # Custom React hooks
│   ├── store/                # Zustand state management setup & slices
│   ├── types/                # TypeScript types/interfaces used in frontend
│   ├── utils/                # Utility/helper functions (e.g., formatters)
│   ├── lib/                  # API client logic (e.g., Axios, Fetch wrappers)
│   ├── App.tsx               # Main React component
│   ├── index.css             # Entry CSS (global styles)
│   ├── index.html            # Entry point
│   ├── landing.html          # Static landing page
│   ├── main.tsx              # Entry point for React
│   ├── package.json          # Frontend dependencies & scripts
│   ├── routes.tsx            # React Router configuration
│   ├── tsconfig.json         # TypeScript config for frontend
│   └── vite.config.ts        # Vite build & dev server configuration
│
└── package.json              # Root project package file (can hold shared scripts)
```
