1. In Supabase SQL Editor, run FIX_DATABASE.sql.
2. In Supabase Edge Function secrets, make sure these exist:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
3. Redeploy the Edge Function:
   supabase functions deploy create-user
4. Rebuild and upload this project to Vercel.
5. Log out fully, then log back in with the correct school code.

Why this fix exists:
- The app used public.profiles, but the schema used public.users.
- Auth state was being created multiple times in separate components.
- That combination caused random "Access Denied" and broken reloads.
