create type public.incident_tier as enum ('T1','T2','T3','T4');

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null default now(),
  tier public.incident_tier not null default 'T3',
  category text not null default 'unspecified',
  location_type text not null default 'street',
  institution text,
  description text not null default '',
  ai_summary text,
  ai_confidence numeric,
  ai_rationale text,
  lat double precision not null,
  lng double precision not null,
  pub_lat double precision,
  pub_lng double precision,
  synthetic boolean not null default false,
  saved boolean not null default true
);

create or replace function public.fuzz_incident_location()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  bearing double precision := random() * 2 * pi();
  dist_m double precision := 150 + random() * 150;
begin
  new.pub_lat := new.lat + (dist_m * cos(bearing)) / 111320.0;
  new.pub_lng := new.lng + (dist_m * sin(bearing)) / (111320.0 * cos(radians(new.lat)));
  return new;
end;
$$;

create trigger incidents_fuzz_location
before insert or update of lat, lng on public.incidents
for each row execute function public.fuzz_incident_location();

create table public.action_plans (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents(id) on delete cascade,
  created_at timestamptz not null default now(),
  headline text not null,
  immediate jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  contacts jsonb not null default '[]'::jsonb,
  deadlines jsonb not null default '[]'::jsonb
);

create index incidents_occurred_at_idx on public.incidents (occurred_at desc);
create index action_plans_incident_idx on public.action_plans (incident_id);

grant all on public.incidents to service_role;
grant all on public.action_plans to service_role;

alter table public.incidents enable row level security;
alter table public.action_plans enable row level security;

create view public.public_incidents as
select
  id,
  tier,
  category,
  location_type,
  date_trunc('hour', occurred_at) as occurred_hour,
  pub_lat as lat,
  pub_lng as lng,
  synthetic
from public.incidents
where saved = true
  and occurred_at > now() - interval '24 hours';

grant select on public.public_incidents to anon, authenticated;

-- Synthetic demonstration data: 65 fabricated Manhattan incidents in the last 24 hours.
with catalog(idx, tier, category, location_type, institution, description) as (
  values
    (0, 'T1'::public.incident_tier, 'physical_assault', 'street', null::text, 'Individual shoved and struck while walking home; police responded.'),
    (1, 'T1', 'threatening_message', 'synagogue', 'Midtown Congregation', 'Handwritten threatening note left at a private entrance.'),
    (2, 'T2', 'graffiti_vandalism', 'street', null, 'Swastika spray-painted on a building entrance, discovered in the morning.'),
    (3, 'T2', 'property_damage', 'residential', null, 'Mezuzah torn from a doorframe and destroyed.'),
    (4, 'T2', 'online_threat', 'online', null, 'Account posted a threatening message naming a local congregation.'),
    (5, 'T3', 'verbal_harassment', 'street', null, 'Slurs shouted at a passerby wearing a kippah; no physical contact.'),
    (6, 'T3', 'slur_public', 'subway', 'MTA Subway', 'Slur directed at a family on a subway platform.'),
    (7, 'T3', 'campus_incident', 'campus', 'Columbia University', 'Student group flyers defaced with antisemitic imagery in a dorm lobby.'),
    (8, 'T3', 'campus_incident', 'campus', 'NYU', 'Posters for a Jewish student event torn down and marked.'),
    (9, 'T4', 'exclusion_workplace', 'workplace', 'Midtown Employer', 'Employee repeatedly excluded from meetings after disclosing observance.'),
    (10, 'T4', 'microaggression', 'workplace', 'Financial District Firm', 'Repeated remarks about money and dual loyalty from a coworker.'),
    (11, 'T4', 'microaggression', 'campus', 'Hunter College', 'Ambiguous comments in seminar that single out Jewish students; deniable each time.'),
    (12, 'T2', 'graffiti_vandalism', 'synagogue', 'Upper West Side Congregation', 'Hateful slogan scratched into a side door.')
)
insert into public.incidents (occurred_at, tier, category, location_type, institution, description, lat, lng, synthetic)
select
  now() - (((g * 37) % 1420) || ' minutes')::interval,
  c.tier, c.category, c.location_type, c.institution, c.description,
  40.702 + (((g * 61) % 176)::double precision / 1000.0),
  -74.017 + (((g * 43) % 105)::double precision / 1000.0),
  true
from generate_series(1, 65) as g
join catalog c on c.idx = (g * 7) % 13;