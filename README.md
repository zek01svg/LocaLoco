backend runs on **http://localhost:3000** while the frontend runs on **http://localhost:5173**

steps for usage:
1. after cloning the repo, run `npm install` to install all dependencies within the frontend and backend
2. after installing dependencies, start your WAMP/MAMP server to get MySQL running. 
3. run `npm run db:setup` to create all the needed tables
4. after table insertion, copy and paste the dummy data in `database/dummy.sql` into your mysql workbench and run the insertions
5. finally, run `npm run dev` to start both development servers
