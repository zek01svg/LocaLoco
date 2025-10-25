backend runs on **http://localhost:3000** while the frontend runs on **http://localhost:5173**

steps for usage:
1. after cloning the repo, run `npm install` to install all dependencies within the frontend and backend
2. after installing dependencies, run `cd backend | drizzle-kit migrate` to make all the needed tables in mysql. (ensure that wamp/mamp is running)
3. after table insertion, copy and paste the dummy data in `database/dummy.sql` into your mysql workbench and run the insertions
4. finally, run `npm run dev` to start both development servers
