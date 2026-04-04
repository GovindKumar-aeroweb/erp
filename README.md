# Vidya ERP — Supabase School Management System

This project is a Vite + React school ERP wired to Supabase.

## What is real right now

- Login using Supabase Auth + school code validation
- Dashboard live counts from Supabase
- Students real CRUD (create, list, delete)
- Users real list + create via Supabase Edge Function
- Attendance save by date/class/section
- Notices real CRUD

## Still placeholder / phase 2

- Fees
- Exams
- Admissions
- Library
- Transport
- Hostel
- Profile / settings polish

## Setup

1. Install dependencies
   `npm install`
2. Create `.env.local` using `.env.example`
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run dev server
   `npm run dev`

## Edge function

Deploy `supabase/functions/create-user` and make sure these secrets exist in Supabase:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Database

Use the corrected `schema.sql` you already ran, plus grants for `anon` and `authenticated`.
