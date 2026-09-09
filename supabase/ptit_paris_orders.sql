-- P'tit Paris — commandes à table. Appliqué sur le projet Supabase kaj-system (uvcibhbslsvakmjcfzwx).
-- Rejouez ce fichier tel quel pour recréer le schéma dans un autre projet.

create table if not exists public.ptp_settings (
  key text primary key,
  value text not null
);
insert into public.ptp_settings (key, value) values ('staff_pin', '240926')
on conflict (key) do nothing;

create table if not exists public.ptp_orders (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  table_no int not null check (table_no between 1 and 200),
  guest_name text not null check (char_length(guest_name) between 1 and 60),
  note text,
  items jsonb not null,
  total int not null check (total >= 0),
  status text not null default 'new' check (status in ('new','preparing','ready','served','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ptp_orders_created_idx on public.ptp_orders (created_at desc);
create index if not exists ptp_orders_status_idx on public.ptp_orders (status);

create table if not exists public.ptp_pin_failures (
  ts timestamptz not null default now()
);

alter table public.ptp_orders enable row level security;
alter table public.ptp_settings enable row level security;
alter table public.ptp_pin_failures enable row level security;
revoke all on public.ptp_orders, public.ptp_settings, public.ptp_pin_failures from anon, authenticated;

-- Vérifie le PIN du personnel, avec verrou après 20 échecs en 10 minutes.
create or replace function public.ptp_check_pin(p_pin text)
returns boolean language plpgsql security definer set search_path = public as $$
declare ok boolean;
begin
  if (select count(*) from ptp_pin_failures where ts > now() - interval '10 minutes') > 20 then
    return false;
  end if;
  select exists(select 1 from ptp_settings where key = 'staff_pin' and value = coalesce(p_pin, '')) into ok;
  if not ok then insert into ptp_pin_failures default values; end if;
  return ok;
end $$;
revoke execute on function public.ptp_check_pin(text) from public, anon, authenticated;

create or replace function public.ptp_get_order(p_id uuid)
returns jsonb language sql security definer set search_path = public stable as $$
  select to_jsonb(o) from ptp_orders o where o.id = p_id;
$$;

create or replace function public.ptp_place_order(p_table int, p_name text, p_items jsonb, p_note text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_total int; v_id uuid; v_code text; v_recent int; v_open int;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 40 then
    raise exception 'Panier invalide';
  end if;
  select count(*) into v_recent from ptp_orders where created_at > now() - interval '1 minute';
  if v_recent > 30 then raise exception 'Trop de commandes en même temps, réessayez dans un instant'; end if;
  select count(*) into v_open from ptp_orders
    where table_no = p_table and status in ('new','preparing','ready') and created_at > now() - interval '3 hours';
  if v_open >= 10 then raise exception 'Trop de commandes ouvertes pour cette table'; end if;
  select coalesce(sum((i->>'price')::int * (i->>'qty')::int), 0) into v_total from jsonb_array_elements(p_items) i;
  v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
  insert into ptp_orders (code, table_no, guest_name, note, items, total)
  values (v_code, p_table, left(trim(p_name), 60), nullif(left(trim(coalesce(p_note, '')), 300), ''), p_items, v_total)
  returning id into v_id;
  return ptp_get_order(v_id);
end $$;

-- Le client peut annuler tant que la cuisine n'a pas commencé.
create or replace function public.ptp_cancel_order(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  update ptp_orders set status = 'cancelled', updated_at = now() where id = p_id and status = 'new';
  return ptp_get_order(p_id);
end $$;

create or replace function public.ptp_kitchen_orders(p_pin text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not ptp_check_pin(p_pin) then raise exception 'PIN invalide'; end if;
  return coalesce((
    select jsonb_agg(to_jsonb(o) order by o.created_at asc) from ptp_orders o
    where o.created_at > now() - interval '18 hours' and o.status <> 'cancelled'
  ), '[]'::jsonb);
end $$;

create or replace function public.ptp_set_status(p_pin text, p_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not ptp_check_pin(p_pin) then raise exception 'PIN invalide'; end if;
  if p_status not in ('new','preparing','ready','served','cancelled') then raise exception 'Statut invalide'; end if;
  update ptp_orders set status = p_status, updated_at = now() where id = p_id;
  return ptp_get_order(p_id);
end $$;

create or replace function public.ptp_verify_pin(p_pin text)
returns boolean language sql security definer set search_path = public as $$
  select ptp_check_pin(p_pin);
$$;

create or replace function public.ptp_change_pin(p_pin text, p_new text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not ptp_check_pin(p_pin) then raise exception 'PIN invalide'; end if;
  if p_new !~ '^[0-9]{4,8}$' then raise exception 'Le nouveau PIN doit contenir 4 à 8 chiffres'; end if;
  update ptp_settings set value = p_new where key = 'staff_pin';
  return true;
end $$;
