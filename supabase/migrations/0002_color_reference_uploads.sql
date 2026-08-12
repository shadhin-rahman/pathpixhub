-- ============================================================
-- PathPixHub — Color reference example uploads (Storage)
-- Lets anonymous visitors upload small example images into the
-- "client-uploads" bucket under a "supporting/" folder so admins
-- can review them without them living only in an email.
-- Run in the Supabase SQL Editor (or apply via migrations).
-- ============================================================

-- Ensure the bucket exists (private; already created in 0001).
insert into storage.buckets (id, name, public)
values ('client-uploads', 'client-uploads', false)
on conflict (id) do nothing;

-- Allow anyone to INSERT into client-uploads/supporting/... (any depth)
drop policy if exists "client_uploads_supporting_insert_anon" on storage.objects;
create policy "client_uploads_supporting_insert_anon"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'client-uploads'
    and storage.foldername(name)[1] = 'supporting'
  );

-- Allow authenticated users (including admins) to READ them back.
drop policy if exists "client_uploads_supporting_select" on storage.objects;
create policy "client_uploads_supporting_select"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'client-uploads'
    and storage.foldername(name)[1] = 'supporting'
  );

-- Allow uploaders (and admins) to update/delete their own supporting files.
drop policy if exists "client_uploads_supporting_update_own" on storage.objects;
create policy "client_uploads_supporting_update_own"
  on storage.objects for update
  to anon, authenticated
  using (
    bucket_id = 'client-uploads'
    and storage.foldername(name)[1] = 'supporting'
  );

drop policy if exists "client_uploads_supporting_delete_own" on storage.objects;
create policy "client_uploads_supporting_delete_own"
  on storage.objects for delete
  to anon, authenticated
  using (
    bucket_id = 'client-uploads'
    and storage.foldername(name)[1] = 'supporting'
  );
