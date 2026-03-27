# ReadGenius - Quick Start Guide

## 🚀 Get Started in 5 Steps

### Step 1: Clone & Setup (5 minutes)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/readgenius.git
cd readgenius

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/readgenius.git
git push -u origin main
```

### Step 2: Deploy Website (10 minutes)

**Choose ONE option:**

#### Option A: Vercel (Easiest)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your `readgenius` repository
5. Click "Deploy"
6. Your site is live! 🎉

#### Option B: GitHub Pages
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: "Deploy from a branch" → "main"
4. Your site is live at: `https://YOUR_USERNAME.github.io/readgenius`

#### Option C: Netlify
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Select your repository
5. Click "Deploy site"

### Step 3: Get a Free Domain (5 minutes)

**Option A: Freenom (Completely Free)**
1. Go to https://www.freenom.com
2. Search for `.tk` domain (e.g., `readgenius.tk`)
3. Register for free
4. Point DNS to your Vercel/GitHub Pages site

**Option B: Cheap Domain**
- Namecheap: ~$0.88/year (first year)
- Google Domains: $12/year

### Step 4: Deploy Backend (10 minutes)

**Option A: Google Cloud Run (Recommended)**

```bash
# 1. Install Google Cloud SDK
# Download from: https://cloud.google.com/sdk/docs/install

# 2. Initialize
gcloud init
gcloud auth login

# 3. Create Dockerfile in project root
# (See DEPLOYMENT_GUIDE.md for Dockerfile content)

# 4. Deploy
gcloud run deploy readgenius-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-api-key
```

**Option B: Railway (Simpler)**
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Select your repository
5. Add environment variable: `GEMINI_API_KEY=your-key`
6. Deploy!

### Step 5: Get Google Gemini API Key (5 minutes)

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Gemini API
4. Create API key
5. Copy key and use in deployment

---

## 📋 What You Get

✅ **Professional Website**
- Modern, responsive design
- Feature showcase
- Pricing page
- Call-to-action buttons
- Mobile-friendly

✅ **Working Backend API**
- FastAPI with Gemini integration
- Document analysis endpoints
- Error handling
- CORS configured

✅ **Complete Documentation**
- README with full project overview
- Deployment guide with 3 options
- Application checklist
- API documentation

✅ **Google Cloud Ready**
- Designed for Gemini API
- Cloud Run compatible
- Scalable architecture
- Cost-efficient

---

## 🎯 Next Steps

1. **Customize Your Project**
   - Update `index.html` with your info
   - Change colors/branding
   - Update contact information
   - Add your social links

2. **Test Everything**
   - Visit your website
   - Test all buttons
   - Verify API works
   - Check mobile responsiveness

3. **Prepare Application**
   - Follow `APPLICATION_CHECKLIST.md`
   - Gather screenshots
   - Write descriptions
   - Verify eligibility

4. **Submit Application**
   - Go to https://cloud.google.com/startup/apply
   - Fill out form
   - Submit!

---

## 💰 Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| Website Hosting | FREE | Vercel/GitHub Pages |
| Backend Hosting | FREE | Cloud Run free tier |
| Domain | FREE-$12 | Freenom or cheap registrar |
| Gemini API | FREE | $2,000 credits from program |
| **Total** | **FREE** | ✅ Everything free! |

---

## 📞 Troubleshooting

### Website not loading?
- Check DNS settings
- Wait 24 hours for DNS propagation
- Verify domain is pointing to hosting service

### API not working?
- Check GEMINI_API_KEY is set
- Verify API key is valid
- Check Cloud Run logs: `gcloud run logs readgenius-api`

### Deployment failed?
- Check requirements.txt is correct
- Verify Dockerfile is in root directory
- Check for syntax errors in code

### Domain not working?
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check domain registrar settings

---

## 🎓 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com
- **Google Gemini API**: https://ai.google.dev
- **Vercel Docs**: https://vercel.com/docs
- **Cloud Run**: https://cloud.google.com/run/docs
- **GitHub Pages**: https://pages.github.com

---

## 🚀 You're All Set!

Your ReadGenius project is ready to go. Now:

1. ✅ Deploy your website
2. ✅ Deploy your backend
3. ✅ Get your domain
4. ✅ Prepare your application
5. ✅ Submit to Google Cloud Startup Program

**Good luck! 🎉**

---

## 📧 Need Help?

- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Review `APPLICATION_CHECKLIST.md` for application prep
- See `README.md` for project overview
- Visit https://cloud.google.com/startup/faq for program questions

**Questions? Email: hello@readgenius.app**
