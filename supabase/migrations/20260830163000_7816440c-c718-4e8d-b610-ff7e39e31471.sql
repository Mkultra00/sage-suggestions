revoke all on function public.fuzz_incident_location() from public, anon, authenticated;

create policy "Public can read recent saved incidents"
  on public.incidents
  for select
  to anon, authenticated
  using (saved = true and occurred_at > now() - interval '24 hours');

grant select (id, tier, category, location_type, occurred_at, pub_lat, pub_lng, synthetic)
  on public.incidents to anon, authenticated;

alter view public.public_incidents set (security_invoker = true);