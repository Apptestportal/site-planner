# Site Planner — Azure Setup

This release moves all data (jobs, workers, leave, users, threads) from browser localStorage to **Azure Table Storage** via Azure Functions, so every user sees the same data across devices.

## One-time Azure setup

### 1. Create a Storage Account
1. Azure Portal → **Create a resource** → **Storage account**
2. Pick the same resource group as your Static Web App
3. Performance: **Standard**, Redundancy: **LRS** (cheapest, fine for this)
4. Create. Wait for deployment.

### 2. Get the connection string
1. Open the new storage account
2. Left menu → **Security + networking** → **Access keys**
3. Click **Show** next to key1 → copy the **Connection string**

### 3. Add the connection string to your Static Web App
1. Open your Static Web App in the Portal
2. Left menu → **Settings** → **Environment variables** (or **Configuration** on older portal)
3. Click **Add**
   - Name: `AZURE_STORAGE_CONNECTION_STRING`
   - Value: paste the connection string
4. Save

### 4. Deploy
Push this project to your repo / let GitHub Actions deploy. Static Web Apps will auto-detect the `/api` folder and provision the Functions.

The first time anyone logs in, the `users` table is auto-seeded with the default user list. The first time data is loaded, if your browser has any old localStorage data it will be migrated up to Azure automatically. Otherwise default jobs are seeded.

## Tables created automatically
- `jobs`
- `workers`
- `leave`
- `users`
- `threads`

You don't need to create these by hand — the API creates them on first run.

## Auth notes
This release uses **simple header auth**: each API call sends the user's email and access code in headers, which the server checks against the `users` table. This is fine for an internal tool but not strong security — anyone who inspects browser network traffic can see the codes. Upgrade to Static Web Apps built-in Azure AD auth when you're ready.

## Troubleshooting
- **"Could not load data from server"** on the loading screen → connection string missing or wrong, or Functions not deployed yet. Check the Static Web App **Functions** tab in the portal.
- **Login fails for everyone after deploy** → the users table auto-seeds on first call. Try logging in once as `craig@topcon.com` / `1234`. If that still fails, check that Functions are running.
- **Old jobs missing** → migration only runs when Azure tables are completely empty. If you've already loaded once, your localStorage data wasn't migrated. Manually re-add or contact me to add an admin migration button.

## Cost estimate
Azure Table Storage at this scale: **under AUD $1/month**. Functions on Static Web Apps free tier: **$0**.
