# Supabase Connection Ready

This build is configured for the supplied Supabase project URL and publishable browser key.

Before the first production login:
1. Run `supabase/schema.sql` in Supabase SQL Editor.
2. Create an Email/Password user in Authentication > Users.
3. Copy the Auth user UUID.
4. Run:

```sql
insert into public.user_roles (user_id, role)
values ('AUTH-USER-UUID', 'superadmin')
on conflict (user_id) do update set role = excluded.role;
```

Do not put a service-role/secret key in this frontend.
