# ReadGenius - Free Deployment Guide

## 🚀 Deploy Your Website for FREE

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- ✅ Free tier includes unlimited deployments
- ✅ Automatic HTTPS and custom domain support
- ✅ Serverless functions (for backend)
- ✅ Perfect for startups
- ✅ 1-click deployment from GitHub

**Steps:**

1. **Create GitHub Repository**
   ```bash
   cd readgenius-project
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/readgenius.git
   git push -u origin main
   ```

2. **Sign Up on Vercel**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Choose "GitHub" and authorize
   - Click "Import Project"
   - Select your `readgenius` repository

3. **Configure Project**
   - Framework: "Other" (for static HTML)
   - Root Directory: `.` (current directory)
   - Build Command: (leave empty)
   - Output Directory: `.` (current directory)

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your site is live! 🎉

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain (readgenius.app)
   - Update DNS records at your domain registrar
   - Vercel provides instructions

**Cost:** FREE (up to 100GB bandwidth/month)

---

### Option 2: GitHub Pages (Ultra Simple)

**Why GitHub Pages?**
- ✅ Completely free
- ✅ No setup required
- ✅ Automatic HTTPS
- ✅ Perfect for static sites

**Steps:**

1. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
   - Click "Save"

3. **Your site is live at:**
   - `https://YOUR_USERNAME.github.io/readgenius`

4. **Custom Domain**
   - Settings → Pages → Custom domain
   - Enter: `readgenius.app`
   - Update DNS at your registrar

**Cost:** FREE (unlimited)

---

### Option 3: Netlify (Also Great)

**Why Netlify?**
- ✅ Free tier with generous limits
- ✅ Automatic deployments from GitHub
- ✅ Built-in form handling
- ✅ Serverless functions support

**Steps:**

1. **Sign Up**
   - Go to https://netlify.com
   - Click "Sign up"
   - Choose "GitHub"

2. **Create New Site**
   - Click "New site from Git"
   - Select your repository
   - Build settings: (leave default)
   - Click "Deploy site"

3. **Your site is live!**
   - Netlify provides a free subdomain
   - Add custom domain in Site settings

**Cost:** FREE (up to 300 minutes/month build time)

---

## 🔧 Deploy Backend (Python API)

### Option 1: Google Cloud Run (Recommended)

**Why Cloud Run?**
- ✅ Free tier: 2M requests/month
- ✅ Perfect for FastAPI
- ✅ Auto-scaling
- ✅ Pay only for what you use

**Steps:**

1. **Install Google Cloud SDK**
   ```bash
   # Download from: https://cloud.google.com/sdk/docs/install
   gcloud init
   gcloud auth login
   ```

2. **Create Dockerfile**
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY backend/requirements.txt .
   RUN pip install -r requirements.txt
   COPY backend/ .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy readgenius-api \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY=your-api-key
   ```

4. **Your API is live!**
   - URL: `https://readgenius-api-xxxxx.a.run.app`

**Cost:** FREE (2M requests/month free tier)

---

### Option 2: Railway (Simple Alternative)

**Why Railway?**
- ✅ Free tier: $5/month credit
- ✅ Simple deployment
- ✅ GitHub integration
- ✅ Good for small projects

**Steps:**

1. **Sign Up**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Add environment variables (GEMINI_API_KEY)
   - Railway auto-detects Python/FastAPI
   - Click "Deploy"

**Cost:** FREE ($5/month credit, usually enough)

---

### Option 3: Render (Also Free)

**Why Render?**
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variables
- ✅ Good uptime

**Steps:**

1. **Sign Up**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo
   - Build command: `pip install -r backend/requirements.txt`
   - Start command: `cd backend && uvicorn main:app --host 0.0.0.0`

3. **Deploy**
   - Add environment variables
   - Click "Create Web Service"

**Cost:** FREE (with limitations) or $7/month for better performance

---

## 🌐 Get a Free Domain

### Option 1: Freenom (Completely Free)

- Go to https://www.freenom.com
- Search for `.tk`, `.ml`, `.ga`, `.cf` domains
- Register for free (1-12 months)
- Point to your Vercel/GitHub Pages site

**Cost:** FREE

### Option 2: Cheap Domains

- Namecheap: ~$0.88/year (first year)
- Google Domains: $12/year
- GoDaddy: ~$1/year (first year)

---

## 📋 Complete Deployment Checklist

### Frontend
- [ ] Push code to GitHub
- [ ] Deploy to Vercel/GitHub Pages/Netlify
- [ ] Get custom domain (free or cheap)
- [ ] Test website works
- [ ] Update links in README

### Backend
- [ ] Create Dockerfile
- [ ] Deploy to Cloud Run/Railway/Render
- [ ] Set environment variables (GEMINI_API_KEY)
- [ ] Test API endpoints
- [ ] Update frontend API URLs

### Domain & DNS
- [ ] Register domain (free or cheap)
- [ ] Point DNS to frontend hosting
- [ ] Point API subdomain to backend
- [ ] Enable HTTPS (automatic)
- [ ] Test everything works

### Google Cloud Application
- [ ] Website live and working
- [ ] GitHub repo public with code
- [ ] API working and documented
- [ ] All links in application materials correct
- [ ] Ready to submit!

---

## 💰 Total Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Frontend (Vercel) | FREE | Unlimited deployments |
| Backend (Cloud Run) | FREE | 2M requests/month free |
| Domain (Freenom) | FREE | .tk/.ml/.ga/.cf |
| **Total** | **FREE** | ✅ Everything free! |

---

## 🚀 Quick Start Commands

```bash
# 1. Clone and setup
git clone https://github.com/YOUR_USERNAME/readgenius.git
cd readgenius

# 2. Deploy frontend to Vercel
# (Just connect GitHub repo on vercel.com)

# 3. Deploy backend to Cloud Run
gcloud run deploy readgenius-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-key

# 4. Update frontend API URL in index.html
# Change: const API_URL = "http://localhost:8000"
# To: const API_URL = "https://readgenius-api-xxxxx.a.run.app"

# 5. Done! 🎉
```

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Cloud Run Docs: https://cloud.google.com/run/docs
- GitHub Pages: https://pages.github.com
- Netlify Docs: https://docs.netlify.com

---

**That's it! Your startup is live and ready for the Google Cloud application!** 🚀
