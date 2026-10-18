# Supabase setup — UPT SMPN 1 Baradatu

## 1. Create / select the Supabase project
Create the project in Supabase Dashboard. Do not put a service-role key in this React app.

## 2. Run the database schema
Open **SQL Editor** and run:

`supabase/schema.sql`

This creates:
- `user_roles`
- `school_settings`
- `homepage_sections`
- `news`
- `announcements`
- `agendas`
- `achievements`
- `galleries`
- `services`
- `audit_logs`
- public `site-media` Storage bucket
- RLS policies and role helper functions

## 3. Create the first administrator
In **Authentication → Users**, create an Email/Password user.

Then copy that user's UUID and run:

```sql
insert into public.user_roles (user_id, role)
values ('PASTE-AUTH-USER-UUID-HERE', 'superadmin');
```

## 4. Configure the React project
Copy `.env.example` to `.env.local` and fill:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

The anon/publishable key is intended for the browser. Never put the Supabase service-role/secret key in `.env.local` for this frontend.

## 5. Install and run

```bash
npm install
npm run dev
```

The admin login automatically switches from prototype username/password to Supabase Email/Password when the two `VITE_SUPABASE_*` variables are present.

## 6. Role model
- `superadmin`: all admin controls, including role management in the database.
- `admin`: school settings, homepage controls, content and services.
- `editor`: content modules such as news, announcements, agenda, achievements and gallery.

The database RLS policies are the real security boundary; frontend checks are not treated as security.
