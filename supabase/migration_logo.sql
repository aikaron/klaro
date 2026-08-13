-- Migration : logo personnalisé
-- À exécuter dans le SQL Editor de Supabase (après avoir créé le bucket "logos" en Public)

alter table public.profiles add column if not exists logo_url text;

-- Policies du bucket "logos" : chaque utilisateur ne peut gérer que son propre dossier (nommé par son user id)
create policy "logos_insert_own" on storage.objects for insert
  with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "logos_update_own" on storage.objects for update
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "logos_delete_own" on storage.objects for delete
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "logos_public_read" on storage.objects for select
  using (bucket_id = 'logos');
