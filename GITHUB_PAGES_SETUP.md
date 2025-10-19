# GitHub Pages Setup Instructions

## ✅ What's Already Done
- ✅ Fixed base URL in `vite.config.ts` to match repository name
- ✅ Built the project (dist folder created)
- ✅ Cleaned up unnecessary files (SPRAT_Database, internal docs, etc.)
- ✅ Pushed changes to main branch

## 🚀 Enable GitHub Pages (2 Minutes!)

### Option 1: Use GitHub Actions (RECOMMENDED - Easier)

1. **Go to your GitHub repository:**
   https://github.com/diaboliquepapillon/FIT3179-DataVisualisation2-ThreatenedSpecies

2. **Click on "Settings"** (top right tab)

3. **In the left sidebar, click "Pages"**

4. **Under "Build and deployment":**
   - Source: Select **"GitHub Actions"**
   
5. **Create workflow file** - Click "Browse all workflows"
   - Search for "Vite"
   - Click "Configure" on the "Deploy Vite site to Pages" workflow
   - This will create `.github/workflows/deploy.yml`
   - Click "Commit changes"

6. **Wait 2-3 minutes** for the action to run
   - Go to "Actions" tab to watch progress
   - Once complete (green checkmark), your site will be live!

7. **Your site will be available at:**
   ```
   https://diaboliquepapillon.github.io/FIT3179-DataVisualisation2-ThreatenedSpecies/
   ```

---

### Option 2: Manual Deployment (If Actions doesn't work)

If GitHub Actions gives you trouble, use this manual approach:

1. **On your local machine, run:**
   ```bash
   cd /Users/aylinvahabova/Desktop/FIT3179-DataVisualisation2-ThreatenedSpecies
   
   # Delete old gh-pages branch if it exists
   git branch -D gh-pages 2>/dev/null
   git push origin --delete gh-pages 2>/dev/null
   
   # Create fresh gh-pages branch from dist
   git checkout --orphan gh-pages
   git reset --hard
   cp -r dist/* .
   cp dist/.* . 2>/dev/null
   git add -A
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages --force
   git checkout main
   ```

2. **Then on GitHub:**
   - Go to Settings → Pages
   - Source: Select **"Deploy from a branch"**
   - Branch: Select **"gh-pages"** / **"/ (root)"**
   - Click "Save"

3. **Wait 2-3 minutes** and your site will be live!

---

## 🔍 Why Automatic Deployment Failed

The automatic `gh-pages` npm package failed because:
- JavaScript bundle is 1.7MB (large!)
- GitHub has push size limits via HTTP
- HTTP 400 error when pushing large binary chunks

**This is normal!** Many Vite projects have this issue. That's why GitHub Actions is recommended.

---

## ✅ Verify It's Working

Once deployed, test your site at:
```
https://diaboliquepapillon.github.io/FIT3179-DataVisualisation2-ThreatenedSpecies/
```

**Things to check:**
- ✅ Map loads and displays correctly
- ✅ Can click on states
- ✅ Wildlife Windows show up
- ✅ All visualizations render
- ✅ Navigation works
- ✅ No 404 errors in browser console

---

## 📝 For Your Assignment Submission

**GitHub Pages URL to submit:**
```
https://diaboliquepapillon.github.io/FIT3179-DataVisualisation2-ThreatenedSpecies/
```

**Repository URL:**
```
https://github.com/diaboliquepapillon/FIT3179-DataVisualisation2-ThreatenedSpecies
```

---

## 🆘 Troubleshooting

### Site shows blank page
- Check browser console for errors
- Verify the base URL in vite.config.ts matches repository name
- Make sure GitHub Pages is enabled in Settings

### 404 errors for assets
- Base URL might be wrong
- Check that dist folder was built correctly

### CSS not loading
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check GitHub Pages source is set correctly

---

## 📊 Files Cleaned Up

Deleted these files to reduce repository size:
- ❌ SPRAT_Database (693KB - not needed)
- ❌ bun.lockb (binary lock file)
- ❌ IMPLEMENTATION_COMPLETE.md (internal docs)
- ❌ PRIORITY_CHECKLIST.md (internal docs)
- ❌ QUICK_SETUP.md (internal docs)
- ❌ START_HERE.md (internal docs)
- ❌ QUALITY_IMPROVEMENTS.md (internal docs)
- ❌ public/INSTALLATION_NOTES.md (internal docs)

**These were just development notes and not needed for the assignment submission!**

---

**Your site is ready to go live! Just follow Option 1 above (GitHub Actions) - it's the easiest!** 🚀

