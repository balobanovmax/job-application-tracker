# Environment Variables Setup

This document explains all environment variables needed for local development and production deployment.

---

## 📁 **File Structure**

```
project/
├── server/.env          # Backend environment variables
└── client/.env          # Frontend environment variables
```

---

## 🖥️ **Backend Environment Variables** (`server/.env`)

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# Server Configuration
PORT=3001
NODE_ENV=development

# Auth0 Configuration (for JWT verification)
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### **Production Values:**
- `DATABASE_URL`: Your production PostgreSQL connection string (e.g., from Render, Railway, Supabase)
- `PORT`: Usually provided by hosting platform (e.g., Render sets this automatically)
- `NODE_ENV`: Set to `production`
- `CLIENT_URL`: Your deployed frontend URL (e.g., `https://your-app.vercel.app`)

---

## 🌐 **Frontend Environment Variables** (`client/.env`)

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier

# Backend API URL
VITE_API_URL=http://localhost:3001
```

### **Production Values:**
- `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-api.onrender.com`)
- Auth0 values remain the same (unless you create separate Auth0 apps for dev/prod)

---

## 🚀 **Deployment Checklist**

### **Backend (e.g., Render, Railway, Fly.io)**

1. Set environment variables in hosting dashboard:
   ```
   DATABASE_URL=<production-postgres-url>
   PORT=<auto-set-by-platform>
   NODE_ENV=production
   AUTH0_DOMAIN=<your-auth0-domain>
   AUTH0_AUDIENCE=<your-auth0-audience>
   CLIENT_URL=<your-deployed-frontend-url>
   ```

2. Update Auth0 Dashboard:
   - Add production backend URL to **Allowed Origins (CORS)**
   - Example: `https://your-api.onrender.com`

### **Frontend (e.g., Vercel, Netlify, Cloudflare Pages)**

1. Set environment variables in hosting dashboard:
   ```
   VITE_AUTH0_DOMAIN=<your-auth0-domain>
   VITE_AUTH0_CLIENT_ID=<your-auth0-client-id>
   VITE_AUTH0_AUDIENCE=<your-auth0-audience>
   VITE_API_URL=<your-deployed-backend-url>
   ```

2. Update Auth0 Dashboard:
   - Add production frontend URL to:
     - **Allowed Callback URLs**: `https://your-app.vercel.app`
     - **Allowed Logout URLs**: `https://your-app.vercel.app`
     - **Allowed Web Origins**: `https://your-app.vercel.app`

---

## 🔒 **Security Notes**

- ✅ **Never commit `.env` files** to Git (already in `.gitignore`)
- ✅ **Use different Auth0 applications** for dev/staging/production (recommended)
- ✅ **Rotate secrets regularly** in production
- ✅ **Use HTTPS** for all production URLs

---

## 🧪 **Testing Environment Variables**

### **Backend:**
```bash
cd server
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL ? '✓ DATABASE_URL loaded' : '✗ DATABASE_URL missing')"
```

### **Frontend:**
```bash
cd client
npm run dev
# Check browser console for: import.meta.env.VITE_API_URL
```

---

## 📝 **Example Production URLs**

### **Backend on Render:**
```
VITE_API_URL=https://job-tracker-api.onrender.com
```

### **Frontend on Vercel:**
```
CLIENT_URL=https://job-tracker.vercel.app
```

### **Auth0 Callback URLs:**
```
https://job-tracker.vercel.app
https://job-tracker.vercel.app/callback (if using custom callback route)
```

---

## ❓ **Troubleshooting**

### **"Failed to sync user" error:**
- Check `VITE_API_URL` is correct
- Verify backend is running and accessible
- Check CORS settings in backend

### **"Invalid token" error:**
- Verify `AUTH0_AUDIENCE` matches in both frontend and backend
- Check `AUTH0_DOMAIN` is correct
- Ensure token hasn't expired

### **CORS errors:**
- Add frontend URL to `CLIENT_URL` in backend
- Update Auth0 Allowed Origins

---

## 📚 **Related Documentation**

- [Auth0 Setup Guide](https://auth0.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js dotenv](https://github.com/motdotla/dotenv)

