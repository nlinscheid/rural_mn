# Quick Setup Guide - View Your CWA App on iPhone

## Problem
Clicking `index.html` in GitHub shows code instead of the web app.

## Solution: Enable GitHub Pages

### Steps (Do this on your computer or phone):

1. **Go to your repository on GitHub:**
   - Navigate to: https://github.com/nlinscheid/rural_mn

2. **Open Settings:**
   - Click the "Settings" tab (top right of your repository)

3. **Find Pages:**
   - In the left sidebar, click "Pages" (under "Code and automation")

4. **Configure Pages:**
   - Under "Source", select: **Deploy from a branch**
   - Under "Branch", select: **claude/cognitive-work-analysis-app-Nqocv**
   - Leave the folder as **/ (root)**
   - Click **Save**

5. **Wait 1-2 minutes** for deployment

6. **Access Your App:**
   - Your app will be live at: **https://nlinscheid.github.io/rural_mn/**
   - Bookmark this URL on your iPhone!

## Alternative: Merge to Main Branch

If you want the app on your main branch instead:

1. Create a pull request from `claude/cognitive-work-analysis-app-Nqocv` to your main branch
2. Merge it
3. In GitHub Pages settings, select your main branch instead
4. The app will be at the same URL: https://nlinscheid.github.io/rural_mn/

## Need Help?

If you need me to create a pull request for you, just ask!

---

**Note:** Once GitHub Pages is enabled, you can access the app from any device by visiting the URL. The app works completely in your browser - no server needed!
