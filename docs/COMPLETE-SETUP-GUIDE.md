# 📘 Complete Setup Guide - TypeRacer Project

## 🎯 Overview
Is guide mein hum **scratch se complete TypeRacer project** setup karenge. Bilkul beginner-friendly, step-by-step, har command ka explanation ke saath!

---

## 📋 Prerequisites (Pehle Ye Install Karo)

### 1. **VS Code (Code Editor)**

**Kya hai ye?**  
VS Code ek code editor hai jisme hum code likhte hain. Bahut powerful aur free hai!

**Kaise install kare:**
1. Website kholo: https://code.visualstudio.com/
2. Download button pe click karo
3. Downloaded file ko run karo aur install karo
4. Install hone ke baad VS Code open karo

**✅ Verification:**
```bash
code --version
```
**Expected Output:**
```
1.85.0
abc123def
x64
```

---

### 2. **Node.js & npm (JavaScript Runtime)**

**Kya hai ye?**  
Node.js JavaScript ko computer pe run karne deta hai (browser ke bahar). npm ek package manager hai jo libraries install karta hai.

**Kaise install kare:**
1. Website kholo: https://nodejs.org/
2. **LTS version** (Long Term Support) download karo - ye stable hota hai
3. Downloaded file run karo aur install karo
4. Installation mein "Automatically install necessary tools" checkbox ko check karo

**✅ Verification:**
```bash
node --version
npm --version
```

**Expected Output:**
```
v18.17.0  (ya koi bhi v16+ version)
9.8.1     (ya koi bhi v8+ version)
```

---

### 3. **MongoDB (Database)**

**Kya hai ye?**  
MongoDB ek NoSQL database hai jisme hum users, tests, races ka data store karte hain.

**Kaise install kare:**

#### Option 1: MongoDB Community Edition (Local - Recommended for Beginners)

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. MongoDB Community Server download karo
3. Install karo (Complete installation choose karo)
4. Install as a Service - checkbox ON rakho

**MacOS:**
```bash
# Homebrew se install karo
brew tap mongodb/brew
brew install mongodb-community@7.0
```

**Linux (Ubuntu/Debian):**
```bash
# Official MongoDB repository add karo
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install karo
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start karo
sudo systemctl start mongod
sudo systemctl enable mongod
```

**✅ Verification:**
```bash
mongod --version
```

**Expected Output:**
```
db version v7.0.4
Build Info: ...
```

#### Option 2: MongoDB Atlas (Cloud - No Installation Required)

**Ye kya hai?**  
Cloud-based MongoDB service - kuch install karne ki zarurat nahi!

**Setup Steps:**
1. Website kholo: https://www.mongodb.com/cloud/atlas
2. "Try Free" pe click karke account banao
3. Free tier (M0) select karo
4. Cloud provider choose karo (AWS recommended)
5. Cluster create karo (2-3 minutes lagega)
6. "Connect" button click karo
7. "Connect your application" choose karo
8. Connection string copy karo (ye baad mein `.env` file mein use hoga)

---

### 4. **Git (Version Control)**

**Kya hai ye?**  
Code ko track karne aur GitHub se clone karne ke liye.

**Kaise install kare:**
- **Windows:** https://git-scm.com/download/win
- **MacOS:** `brew install git`
- **Linux:** `sudo apt-get install git`

**✅ Verification:**
```bash
git --version
```

**Expected Output:**
```
git version 2.40.0
```

---

## 🚀 Project Setup (Ab Actual Project Setup Karte Hain)

### Step 1: Repository Clone Karo

**Terminal/Command Prompt kholo aur ye command run karo:**

```bash
# Project clone karo
git clone https://github.com/Guru54/racer-45.git

# Project folder mein jao
cd racer-45
```

**Kya hua ab?**  
Tumhare computer pe `racer-45` naam ka folder ban gaya hai jisme pura project code hai!

**✅ Verification:**
```bash
ls
# Ya Windows mein: dir
```

**Expected Output:**
```
client/
server/
README.md
```

---

### Step 2: Backend Setup

**Backend kya hai?**  
Backend server-side code hai jo database se connect hota hai, APIs provide karta hai.

#### 2.1 Backend Folder Mein Jao

```bash
cd server
```

#### 2.2 Dependencies Install Karo

**Dependencies kya hain?**  
Ye libraries/packages hain jo humara backend use karta hai (Express, MongoDB driver, etc.)

```bash
npm install
```

**Kya ho raha hai?**  
npm `package.json` file ko read karke saari required libraries download kar raha hai aur `node_modules/` folder mein save kar raha hai.

**Time:** 1-2 minutes lag sakta hai (internet speed pe depend karta hai)

**✅ Verification:**
```bash
ls node_modules/
# Ya: dir node_modules\
```

**Expected Output:**
```
bcryptjs/
cors/
dotenv/
express/
jsonwebtoken/
mongoose/
socket.io/
... (aur bhi bahut saare folders)
```

#### 2.3 Environment Variables Setup (.env File)

**Environment variables kya hain?**  
Ye secret configurations hain jo code mein hardcode nahi karte (like database password, JWT secret).

**`.env` file banao:**

```bash
# Windows mein:
type nul > .env

# MacOS/Linux mein:
touch .env
```

**Ab `.env` file ko VS Code mein open karo aur ye content paste karo:**

```env
# Server Port
PORT=5000

# MongoDB Connection String
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/typing-racer

# Option 2: MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typing-racer?retryWrites=true&w=majority

# JWT Secret (apna unique secret key daalo)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# JWT Token Expiry
JWT_EXPIRE=7d

# Environment (development ya production)
NODE_ENV=development

# Frontend URL (CORS ke liye)
CORS_ORIGIN=http://localhost:5173
```

**⚠️ Important Notes:**
- `JWT_SECRET`: Production mein ye change karna **MUST** hai! Ye ek random, strong string honi chahiye
- `MONGODB_URI`: Agar MongoDB Atlas use kar rahe ho to apna connection string yahan paste karo

**✅ Verification:**
```bash
cat .env
# Ya Windows: type .env
```

File ka content dikhai dena chahiye.

#### 2.4 Backend Server Run Karo

**Development mode mein run karo (auto-reload ke saath):**

```bash
npm run dev
```

**Kya hoga?**  
1. Nodemon server start karega
2. MongoDB se connection attempt hoga
3. Server port 5000 pe listen karega

**Expected Output:**
```
[nodemon] 3.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/server.js`
MongoDB Connected: localhost
Server running on port 5000
```

**✅ Verification:**

Browser mein ye URL kholo:
```
http://localhost:5000
```

**Expected Output:**
```json
{
  "message": "Typing Racer API is running"
}
```

**🎉 Congratulations! Backend successfully run ho raha hai!**

---

### Step 3: Frontend Setup

**Frontend kya hai?**  
Frontend user interface hai jo browser mein dikhai deta hai - React se bana hua.

#### 3.1 Naya Terminal Tab/Window Kholo

**Important:** Backend server ko run hone do, usko band mat karo!

#### 3.2 Client Folder Mein Jao

```bash
# Root directory mein ho to:
cd client

# Ya agar server folder mein ho to:
cd ../client
```

#### 3.3 Dependencies Install Karo

```bash
npm install
```

**Kya install ho raha hai?**  
React, Vite (build tool), Tailwind CSS (styling), Axios (HTTP requests), Socket.io (real-time), aur bhi bahut kuch!

**Time:** 2-3 minutes lag sakta hai

**✅ Verification:**
```bash
ls node_modules/
```

**Expected Output:**
```
react/
react-dom/
axios/
socket.io-client/
tailwindcss/
... (500+ packages)
```

#### 3.4 Environment Variables Setup (.env File)

**Client folder mein bhi `.env` file banao:**

```bash
# Windows:
type nul > .env

# MacOS/Linux:
touch .env
```

**Content paste karo:**

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# Socket.io Server URL
VITE_SOCKET_URL=http://localhost:5000
```

**Note:** Vite mein environment variables ka naam `VITE_` se start hona chahiye!

#### 3.5 Frontend Server Run Karo

```bash
npm run dev
```

**Kya hoga?**  
1. Vite development server start hoga
2. React app compile hoga
3. Server port 5173 pe run hoga

**Expected Output:**
```
  VITE v5.0.11  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**✅ Verification:**

Browser mein ye URL kholo:
```
http://localhost:5173
```

**Expected:** TypeRacer homepage dikhai dena chahiye with navbar, typing arena, etc.

**🎉 Congratulations! Frontend bhi successfully run ho raha hai!**

---

## 🧪 Complete System Verification

### 1. Check Both Servers

**Backend:** http://localhost:5000 ✅  
**Frontend:** http://localhost:5173 ✅

### 2. Test Registration

1. Frontend pe jao
2. Register page kholo
3. Naya user register karo:
   - Email: test@example.com
   - Username: testuser
   - Password: password123

**Expected:** Successfully register hoke dashboard pe redirect hona chahiye

### 3. Test Database Connection

**MongoDB mein check karo:**

```bash
# MongoDB shell kholo
mongosh

# Database select karo
use typing-racer

# Users check karo
db.users.find()
```

**Expected:** Tumhara registered user dikhai dena chahiye

### 4. Test Real-time Features

1. Two browser tabs kholo (ya ek incognito window)
2. Dono mein alag users se login karo
3. Race create karo
4. Dusre tab se race join karo
5. Type karte dekho - real-time sync ho raha hai?

---

## 📁 Project Structure Overview

Tumhara project ab is tarah dikhna chahiye:

```
racer-45/
│
├── client/                      # Frontend (React)
│   ├── node_modules/           # Frontend dependencies
│   ├── public/                 # Static files
│   ├── src/                    # Source code
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # Context API
│   │   ├── utils/             # Utility functions
│   │   └── styles/            # CSS files
│   ├── .env                    # Frontend environment variables
│   ├── package.json           # Frontend dependencies list
│   └── vite.config.js         # Vite configuration
│
├── server/                     # Backend (Node.js)
│   ├── node_modules/          # Backend dependencies
│   ├── config/                # Configuration files
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── models/            # Database schemas
│   │   ├── routes/            # API endpoints
│   │   ├── socket/            # WebSocket handlers
│   │   ├── middleware/        # Auth, error handling
│   │   └── utils/             # Helper functions
│   ├── .env                   # Backend environment variables
│   └── package.json          # Backend dependencies list
│
└── README.md                  # Project documentation
```

---

## 🎓 What You Learned

✅ **Node.js & npm**: JavaScript runtime aur package manager  
✅ **MongoDB**: NoSQL database installation aur usage  
✅ **Environment Variables**: `.env` files ka use  
✅ **Backend Setup**: Express server configuration  
✅ **Frontend Setup**: React with Vite  
✅ **API Testing**: Postman/Browser se endpoints test karna  
✅ **Real-time Communication**: Socket.io basics  

---

## 📚 Next Steps

Ab ki kya kare?

1. **📖 Backend Deep Dive**: `BACKEND-GUIDE.md` padho - har file detail mein explain ki gayi hai
2. **⚛️ Frontend Deep Dive**: `FRONTEND-GUIDE.md` padho - components ka architecture samjho
3. **🔌 API Understanding**: `API-DOCUMENTATION.md` padho - APIs kaise use kare
4. **🚀 Deployment**: `DEPLOYMENT-GUIDE.md` padho - project ko online deploy kaise kare

---

## ❓ Common Issues & Quick Fixes

### Issue 1: "Port 5000 already in use"

**Solution:**
```bash
# Port ko manually change karo .env mein
PORT=5001
```

### Issue 2: "MongoDB connection failed"

**Solution:**
```bash
# Check MongoDB service running hai ya nahi
# Windows:
net start MongoDB

# MacOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Issue 3: "npm install errors"

**Solution:**
```bash
# Cache clear karo
npm cache clean --force

# Phir se install karo
npm install
```

---

## 💡 Tips for Beginners

1. **Terminal mein errors padhna seekho** - Errors helpful hote hain, dar mat jao!
2. **Ek baar mein ek feature build karo** - Step by step jao
3. **Console.log use karo** - Debugging ke liye
4. **Git commits regularly karo** - Code safe rahega
5. **Documentation padhte raho** - Har cheez samajh mein aayegi

---

## 🆘 Need Help?

Agar koi problem aa rahi hai to:

1. **TROUBLESHOOTING.md** check karo - Common issues ka solution hai
2. **FAQ.md** dekho - Frequently Asked Questions
3. GitHub Issues pe post karo
4. Stack Overflow pe search karo

---

**🚀 Happy Coding! Ab tum ready ho project ko explore karne ke liye!**
