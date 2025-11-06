backend runs on **http://localhost:3000** while the frontend runs on **http://localhost:5173**

steps for usage:
1. after cloning the repo, run `npm install` to install all dependencies within the frontend and backend
2. after installing dependencies, start your WAMP/MAMP server to get MySQL running. 
3. run `npm run db:setup` to create all the needed tables
4. after table insertion, copy and paste the dummy data in `database/dummy.sql` into your mysql workbench and run the insertions
5. finally, run `npm start` to start both development servers

# 🏫 IS216 Web Application Development II

---

## Section & Group Number
G10 Group 3  

---

## Group Members

| Name | Role & Contributions |
|------|------------------------|
| **Suan Loong** | Frontend Developer — Landing map UI, sidebar, advanced search overlay |
| **Jolene** | Frontend Developer — Business card & details components, explore page, bookmark UX, UI polish |
| **Charles** | Backend Developer — BE lead: data feed, filter logic/endpoints, local storage, build & deploy |
| **Pamika Lim** | UI / Frontend — Assets & styles; Google Maps API/UI + distance/geolocate + forum, profile page, OneMap API + postal code/address conversion |
| **Lin Hui** | Backend Developer — Business UEN verification, Google Safe Browsing link verification (API), referral code UI and backend |



---

## Business Problem

> Small local businesses struggle to maintain an online presence, limiting visibility to customers. Local shoppers also struggle to discover and trust nearby independent businesses because key information is scattered and inconsistent.
> Our web application provides a one-stop-for-all platform for shoppers to support and explore different local businesses, and for local entrepreneurs to reach more customers and grow their presence.

Github URL: https://github.com/zek01svg/LocaLoco.git

---

## Web Solution Overview

### 🎯 Intended Users
Primary - local shoppers looking for nearby local/independent shops/small businesses to support
Secondary - independent, local businesses that need discovery and have troubles reaching customers

### 💡 What Users Can Do & Benefits
Explain the core features and the benefit each provides.  



| **Feature** | **Description** | **User Benefit** |
|--------------|-----------------|------------------|
| **Interactive Map View (Google Maps API)** | Displays nearby local businesses as map pins, showing their distance from the user. Users can tap to view store details or get directions. | Enables effortless discovery of nearby shops and cafes, making it easy to explore and support local businesses. |
| **Search & Filter Function** | Allows users to search for specific businesses or filter by category (e.g., food, fashion, services, price). | Saves time by helping users quickly find exactly what they’re looking for based on their interests. |
| **Vendor Profiles / Storefronts** | Each business has a dedicated page showing its description, photos, contact info, operating hours, and embedded map location. | Provides shoppers with essential information at a glance and helps businesses present their brand professionally. |
| **Announcements Section** | Displays the latest events, promotions, or new openings from local businesses. | Keeps users updated on current happenings and encourages them to visit or participate in local events. |
| **Reviews & Ratings** | Users can rate and review businesses they’ve visited, and view feedback from others. | Builds trust and helps users make informed choices while giving businesses valuable feedback. |
| **Community Forum** | A space for users to discuss and share experiences or recommendations about local businesses. | Fosters a sense of community and promotes engagement among local shoppers and merchants. |
| **Vendor Onboarding & Verification** | Businesses can sign up, verify their legitimacy (e.g., UEN), and manage multiple listings if they own more than one outlet. | Ensures authenticity of businesses and gives small vendors a reliable way to publicize themselves. |
| **Referral & Rewards System** | Each new user receives a unique referral code upon signup. When friends register using the code, both parties earn a $5 voucher. If a referral code is used more than five times, the reward increases to $10. | Encourages user and platform growth through word-of-mouth while rewarding loyal users for promoting the platform. |
| **Profile Page** | Displays user details such as name, email, profile picture, reviews, loyalty points, and vouchers. | Allows users to track their activity, manage their rewards, and personalize their experience. |
| **Edit Profile Overlay** | Lets users update their personal details including name, email, location, and profile photo directly within the app. | Empowers users to maintain accurate and personalized information with ease. |
| **Link Verification** | Automatically checks URLs uploaded by businesses to ensure they’re safe and not malicious. | Protects users from fraudulent or harmful links, improving trust and platform security. |
| **Announcements Popup (Explore Tab)** | When users tap on the *Explore* tab, a popup highlights current announcements such as promotions, new store openings, or community events. | Instantly informs users about the latest local happenings without needing to search manually, encouraging timely visits and engagement. |

---

## Tech Stack

| Logo | Technology | Purpose / Usage |
|:--:|:--|:--|
| 🖥️ | **React.js + TypeScript** | Frontend framework for building a responsive, interactive UI with strong typing and reusable components. |
| 🎨 | **Tailwind CSS** | Utility-first CSS framework for consistent, fast, and mobile-responsive styling. |
| ⚙️ | **Node.js + TypeScript** | Backend runtime and language used to handle API logic, authentication, and integrations. (Migrated from PHP for better scalability and maintainability.) |
| 🗄️ | **MySQL + Express.js** | Relational database storing business listings, user accounts, bookmarks, and reviews. |
| ☁️ | **GitHub + Azure** | Used for version control, continuous integration, and cloud deployment of the application. |
| 🗺️ | **Google Maps JavaScript API** | Powers live maps, markers, and location-based discovery. Also used for geocoding (address → latitude/longitude) and directions display. |
| 📍 | **OneMap API (Singapore)** | Converts postal codes into formatted addresses, which are then passed to Google Maps API for coordinate generation and storage in the database. |
| 🔗 | **Better-Auth + Drizzle orm** | Secure authentication system for users & sessions, Type-safe ORM with automatic TS inference.  |




---

## Use Case & User Journey


1. **Map Page**  
   <img src="screenshots/maps.png" width="600">  
   - Displays the homepage with google maps navigation options.

2. **Search Feature**  
   <img src="screenshots/search.png" width="600">  
   - Users can browse and filter stores by criteria.

3. **Profile Page**  
   <img src="screenshots/profile.png" width="600">  
   - Shows user's details, vouchers, reviews, loyalty points, referrals and bookmarked businesses.
4. **Forum**  
   <img src="screenshots/forum.png" width="600">  
   - Shows different users coming together to share their experiences about local businesses they have visited.
5. **Notifications**
<img src="screenshots/notifications.png" width="600">  
   - Shows user related activity, new revies, upcoming events and points updates.
6. **Vouchers**
<img src="screenshots/vouchers.png" width="600">  
   - Shows user's points and list vouchers that the user can use their points to reedeem to use in stores. Shows users the vouchers they currently have, as well as expiry date.

---

## Developers Setup Guide

Comprehensive steps to help other developers or evaluators run and test LocaLoco.

---

### 0) Prerequisites
- [Git](https://git-scm.com/) v2.4+  
- [Node.js](https://nodejs.org/) v18+ and npm v9+  
- MySQL Workbench

---

### 1) Download the Project
```bash
git clone https://github.com/zek01svg/LocaLoco.git
cd LocaLoco
npm install
cd backend
npm install
cd ..
```

---

### 2) Configure Environment Variables
Create a `.env` file in the root directory with the following structure:

```bash
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=root
DB_NAME=wad2_project
DB_PORT=3306
DATABASE_URL=mysql://root:your_mysql_password@localhost:3306/wad2_project

# Better Auth Configuration
BETTER_AUTH_SECRET=<insert>
BETTER_AUTH_URL=http://localhost:3000

# for better-auth
BETTER_AUTH_SECRET=IL2bYHh4ztTrsgiFcLBrE5t8iykNCVh7
BETTER_AUTH_URL=http://localhost:3000

```



---

### 3) Database Setup

#### MySQL Database
1. **Start MySQL Server**
   - Make sure your MySQL server is running on `localhost:3306`
   
2. **Create Database**
   ```sql
   CREATE DATABASE wad2_project;
   ```

3. **Import Schema & Data** (if SQL dump is provided)
   ```bash
   mysql -u root -p wad2_project < backend/src/database/newdummy.sql
   ```

4. Push Schema using Drizzle
   ```bash
   cd backend
   npm run db:push
   ```

5. **Verify Database**
   - Check that tables exist: `user`, `businesses`, `referrals`, `vouchers`, `session`, etc.
   - The database includes two triggers for auto-generating referral codes on user signup and vouchers

---

### 4) Run the Application

#### Development Mode 
Start both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:3000](http://localhost:3000)

#### Production Build
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

### 6) Common Issues & Fixes

| Issue | Cause | Fix |
|:--|:--|:--|
| **`ERR_CONNECTION_REFUSED`** | Backend not running | Ensure MySQL is running, check `.env` credentials |
| **`Cannot find module`** | Missing dependencies | Run `npm install` in root AND `cd backend && npm install` |
| **`Database connection failed`** | Wrong credentials or DB not created | Verify `.env` DB settings, create `wad2_project` database |
| **`Merge conflict marker`** | Git conflicts in code files | Resolve conflicts, remove `<<<<<<<`, `=======`, `>>>>>>>` markers |
| **`npm run dev` fails**  | Node version or port conflict | Check `node -v` ≥ 18, kill processes on ports 3000 & 5173 |
| **TypeScript errors** | Pre-existing code issues | These are warnings; app should still run in dev mode |
| **Logout returns 400** | Better-auth route issue | Ensure `/api/auth/*` handler is registered before other routes |
| **Referral code invalid** | Database trigger not set | Run the SQL trigger script or check `referrals` table schema |

---

### 7) Project Structure

```
LocaLoco/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API request handlers
│   │   ├── models/          # Database operations
│   │   ├── routes/          # API routes
│   │   ├── database/        # Schema & DB config
│   │   ├── lib/             # Auth & utilities
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks (useAuth, useUser)
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript types
│   └── lib/                 # Auth client
├── package.json             # Frontend dependencies & scripts
├── .env                     # Environment variables (DO NOT COMMIT)
└── README.md
```

---

## Group Reflection

Each member should contribute 2–3 sentences on their learning and project experience.

> **Example Template:**  
> - *Pamika:* Understood how Gmaps API and OneMaps API works, exploration of Figma, and reinforced knowledge on how to retrieve, convert and store coordinates in the database.
