# Netlify Environment Variable Setup

## Required Environment Variable

To fix the pharmacy and diagnostic centers routes on production, you need to configure the Netlify environment variable.

### Step-by-Step Instructions:

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/sites/curesphereai/settings/deploys

2. **Navigate to Environment Variables**
   - Click on "Environment variables" in the left sidebar
   - OR go directly to: https://app.netlify.com/sites/curesphereai/settings/env

3. **Add New Variable**
   - Click "Add a variable" or "Add environment variable"
   - Key: `VITE_API_BASE_URL`
   - Value: `https://curesphereai.vercel.app`
   - Scope: All (Production, Deploy Previews, Branch deploys)

4. **Save and Redeploy**
   - Click "Save"
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

### Why This Is Needed

The frontend code automatically appends `/api` to the base URL, so:
- `VITE_API_BASE_URL` = `https://curesphereai.vercel.app`
- Actual API calls = `https://curesphereai.vercel.app/api/pharmacies`

### Verification

After deployment completes (2-3 minutes):
1. Visit: https://curesphereai.netlify.app
2. Navigate to Pharmacy Finder
3. Open browser DevTools (F12) → Network tab
4. Refresh the page
5. You should see successful API calls to `https://curesphereai.vercel.app/api/pharmacies`

### Alternative: Check Current Environment Variables

To see what's currently set:
```bash
netlify env:list --site curesphereai
```

Or via Netlify CLI:
```bash
netlify env:set VITE_API_BASE_URL https://curesphereai.vercel.app
```

---

**Status**: Backend is working ✅ (data seeded successfully)
**Issue**: Frontend needs environment variable to connect to backend
**Solution**: Add `VITE_API_BASE_URL` in Netlify settings
