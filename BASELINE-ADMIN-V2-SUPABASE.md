# ADMIN PANEL V2 — SUPABASE FOUNDATION

Built cumulatively from `smpn1-baradatu-admin-v1-locked.zip`.

This baseline adds:
- Supabase JS client with environment-based configuration.
- Supabase Email/Password authentication for admin login.
- Role lookup from `user_roles`.
- Supabase-backed CRUD for content modules.
- Supabase-backed homepage visibility settings.
- Supabase-backed school profile settings.
- Supabase-backed audit log insertion/read.
- Production-oriented RLS schema and public media bucket policies.
- Local prototype fallback remains available when Supabase environment variables are absent.

The public website is intentionally not switched to Supabase in this step; that will be the next integration step after the admin connection is verified.
