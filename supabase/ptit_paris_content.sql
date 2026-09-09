-- P'tit Paris — contenu éditable depuis le centre de contrôle (/admin) : carte, annonces, infos, médias.

create table if not exists public.ptp_sections (
  id text primary key,
  books text[] not null default '{diner}',
  title text not null,
  tagline text,
  note text,
  dual text,
  gallery jsonb not null default '[]',
  position int not null default 0,
  visible boolean not null default true
);

create table if not exists public.ptp_items (
  id uuid primary key default gen_random_uuid(),
  section_id text not null references public.ptp_sections(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text,
  price int not null check (price >= 0),
  price2 int check (price2 is null or price2 >= 0),
  tags text[] not null default '{}',
  photo text,
  position int not null default 0,
  available boolean not null default true,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);
create index if not exists ptp_items_section_idx on public.ptp_items (section_id, position);

create table if not exists public.ptp_posts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('plat_du_jour','annonce','partenaire','pub')),
  title text not null,
  body text,
  image text,
  link text,
  cta text,
  price int check (price is null or price >= 0),
  starts_at date,
  ends_at date,
  active boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ptp_media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mime text not null,
  size int not null,
  data bytea not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ptp_site (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb
);
insert into public.ptp_site (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;
insert into public.ptp_settings (key, value) values ('admin_password', 'paris2026') on conflict (key) do nothing;

alter table public.ptp_sections enable row level security;
alter table public.ptp_items enable row level security;
alter table public.ptp_posts enable row level security;
alter table public.ptp_media enable row level security;
alter table public.ptp_site enable row level security;
revoke all on public.ptp_sections, public.ptp_items, public.ptp_posts, public.ptp_media, public.ptp_site from anon, authenticated;

-- Lecture publique ------------------------------------------------------------

create or replace function public.ptp_menu()
returns jsonb language sql security definer set search_path = public stable as $$
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', s.id, 'books', to_jsonb(s.books), 'title', s.title, 'tagline', s.tagline, 'note', s.note, 'dual', s.dual,
      'gallery', s.gallery, 'position', s.position, 'visible', s.visible,
      'items', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', i.id, 'slug', i.slug, 'name', i.name, 'description', i.description, 'price', i.price, 'price2', i.price2,
          'tags', to_jsonb(i.tags), 'photo', i.photo, 'position', i.position, 'available', i.available, 'visible', i.visible
        ) order by i.position, i.name)
        from ptp_items i where i.section_id = s.id
      ), '[]'::jsonb)
    ) order by s.position, s.title
  ), '[]'::jsonb) from ptp_sections s;
$$;

create or replace function public.ptp_posts()
returns jsonb language sql security definer set search_path = public stable as $$
  select coalesce(jsonb_agg(to_jsonb(p) - 'created_at' order by p.position, p.created_at desc), '[]'::jsonb)
  from ptp_posts p
  where p.active and (p.starts_at is null or p.starts_at <= current_date) and (p.ends_at is null or p.ends_at >= current_date);
$$;

create or replace function public.ptp_site()
returns jsonb language sql security definer set search_path = public stable as $$
  select data from ptp_site where id = 1;
$$;

create or replace function public.ptp_media_get(p_id uuid)
returns jsonb language sql security definer set search_path = public stable as $$
  select jsonb_build_object('mime', mime, 'name', name, 'data', encode(data, 'base64')) from ptp_media where id = p_id;
$$;

-- Administration --------------------------------------------------------------

create or replace function public.ptp_admin_check(p_pwd text)
returns boolean language plpgsql security definer set search_path = public as $$
declare ok boolean;
begin
  if (select count(*) from ptp_pin_failures where ts > now() - interval '10 minutes') > 20 then return false; end if;
  select exists(select 1 from ptp_settings where key = 'admin_password' and value = coalesce(p_pwd, '')) into ok;
  if not ok then insert into ptp_pin_failures default values; end if;
  return ok;
end $$;
revoke execute on function public.ptp_admin_check(text) from public, anon, authenticated;

create or replace function public.ptp_admin_verify(p_pwd text)
returns boolean language sql security definer set search_path = public as $$
  select ptp_admin_check(p_pwd);
$$;

create or replace function public.ptp_admin_media_put(p_pwd text, p_name text, p_mime text, p_b64 text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_data bytea;
begin
  if not ptp_admin_check(p_pwd) then raise exception 'Accès refusé'; end if;
  v_data := decode(p_b64, 'base64');
  if octet_length(v_data) > 2500000 then raise exception 'Image trop lourde (max 2,5 Mo)'; end if;
  insert into ptp_media (name, mime, size, data) values (left(p_name, 120), p_mime, octet_length(v_data), v_data) returning id into v_id;
  return v_id;
end $$;

create or replace function public.ptp_admin(p_pwd text, p_op text, p jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_slug text; v_n int; v_text text; v_i int;
begin
  if not ptp_admin_check(p_pwd) then raise exception 'Accès refusé'; end if;

  if p_op = 'menu' then return ptp_menu();

  elsif p_op = 'section_upsert' then
    v_text := coalesce(nullif(p->>'id',''), lower(regexp_replace(p->>'title', '[^a-zA-Z0-9]+', '-', 'g')));
    insert into ptp_sections (id, books, title, tagline, note, dual, position, visible)
    values (v_text,
            coalesce((select array_agg(x) from jsonb_array_elements_text(coalesce(p->'books','["diner"]'::jsonb)) x), '{diner}'),
            p->>'title', nullif(p->>'tagline',''), nullif(p->>'note',''), nullif(p->>'dual',''),
            coalesce((p->>'position')::int, (select coalesce(max(position),0)+1 from ptp_sections)),
            coalesce((p->>'visible')::boolean, true))
    on conflict (id) do update set books = excluded.books, title = excluded.title, tagline = excluded.tagline,
      note = excluded.note, dual = excluded.dual, visible = excluded.visible,
      position = coalesce((p->>'position')::int, ptp_sections.position);
    return jsonb_build_object('id', v_text);

  elsif p_op = 'section_delete' then
    delete from ptp_sections where id = p->>'id'; return jsonb_build_object('ok', true);

  elsif p_op = 'item_upsert' then
    v_id := nullif(p->>'id','')::uuid;
    v_slug := coalesce(nullif(p->>'slug',''), lower(regexp_replace(p->>'name', '[^a-zA-Z0-9]+', '-', 'g')));
    v_slug := trim(both '-' from v_slug);
    -- unicité du slug pour un nouveau plat
    if v_id is null then
      v_text := v_slug; v_i := 2;
      while exists(select 1 from ptp_items where slug = v_text) loop v_text := v_slug || '-' || v_i; v_i := v_i + 1; end loop;
      v_slug := v_text;
    end if;
    if v_id is null then
      insert into ptp_items (section_id, slug, name, description, price, price2, tags, photo, position, available, visible)
      values (p->>'section_id', v_slug, p->>'name', nullif(p->>'description',''), (p->>'price')::int, nullif(p->>'price2','')::int,
              coalesce((select array_agg(x) from jsonb_array_elements_text(coalesce(p->'tags','[]'::jsonb)) x), '{}'),
              nullif(p->>'photo',''),
              (select coalesce(max(position),0)+1 from ptp_items where section_id = p->>'section_id'),
              coalesce((p->>'available')::boolean, true), coalesce((p->>'visible')::boolean, true))
      returning id into v_id;
    else
      update ptp_items set section_id = coalesce(p->>'section_id', section_id), name = coalesce(p->>'name', name),
        description = nullif(p->>'description',''), price = coalesce((p->>'price')::int, price), price2 = nullif(p->>'price2','')::int,
        tags = coalesce((select array_agg(x) from jsonb_array_elements_text(p->'tags') x), '{}'),
        photo = nullif(p->>'photo',''), available = coalesce((p->>'available')::boolean, available),
        visible = coalesce((p->>'visible')::boolean, visible), updated_at = now()
      where id = v_id;
    end if;
    return jsonb_build_object('id', v_id, 'slug', v_slug);

  elsif p_op = 'item_delete' then
    delete from ptp_items where id = (p->>'id')::uuid; return jsonb_build_object('ok', true);

  elsif p_op = 'item_toggle' then
    update ptp_items set available = coalesce((p->>'available')::boolean, available), visible = coalesce((p->>'visible')::boolean, visible), updated_at = now()
    where id = (p->>'id')::uuid; return jsonb_build_object('ok', true);

  elsif p_op = 'reorder_sections' then
    v_i := 0;
    for v_text in select * from jsonb_array_elements_text(p->'ids') loop
      update ptp_sections set position = v_i where id = v_text; v_i := v_i + 1;
    end loop; return jsonb_build_object('ok', true);

  elsif p_op = 'reorder_items' then
    v_i := 0;
    for v_text in select * from jsonb_array_elements_text(p->'ids') loop
      update ptp_items set position = v_i where id = v_text::uuid; v_i := v_i + 1;
    end loop; return jsonb_build_object('ok', true);

  elsif p_op = 'posts' then
    return coalesce((select jsonb_agg(to_jsonb(x) order by x.position, x.created_at desc) from ptp_posts x), '[]'::jsonb);

  elsif p_op = 'post_upsert' then
    v_id := nullif(p->>'id','')::uuid;
    if v_id is null then
      insert into ptp_posts (kind, title, body, image, link, cta, price, starts_at, ends_at, active, position)
      values (p->>'kind', p->>'title', nullif(p->>'body',''), nullif(p->>'image',''), nullif(p->>'link',''), nullif(p->>'cta',''),
              nullif(p->>'price','')::int, nullif(p->>'starts_at','')::date, nullif(p->>'ends_at','')::date,
              coalesce((p->>'active')::boolean, true), (select coalesce(max(position),0)+1 from ptp_posts))
      returning id into v_id;
    else
      update ptp_posts set kind = coalesce(p->>'kind', kind), title = coalesce(p->>'title', title), body = nullif(p->>'body',''),
        image = nullif(p->>'image',''), link = nullif(p->>'link',''), cta = nullif(p->>'cta',''), price = nullif(p->>'price','')::int,
        starts_at = nullif(p->>'starts_at','')::date, ends_at = nullif(p->>'ends_at','')::date,
        active = coalesce((p->>'active')::boolean, active)
      where id = v_id;
    end if;
    return jsonb_build_object('id', v_id);

  elsif p_op = 'post_delete' then
    delete from ptp_posts where id = (p->>'id')::uuid; return jsonb_build_object('ok', true);

  elsif p_op = 'site' then return coalesce((select data from ptp_site where id = 1), '{}'::jsonb);

  elsif p_op = 'site_set' then
    update ptp_site set data = coalesce(p, '{}'::jsonb) where id = 1; return jsonb_build_object('ok', true);

  elsif p_op = 'media' then
    return coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'mime', mime, 'size', size, 'created_at', created_at) order by created_at desc) from ptp_media), '[]'::jsonb);

  elsif p_op = 'media_delete' then
    delete from ptp_media where id = (p->>'id')::uuid; return jsonb_build_object('ok', true);

  elsif p_op = 'set_password' then
    if length(p->>'next') < 6 then raise exception 'Mot de passe : 6 caractères minimum'; end if;
    update ptp_settings set value = p->>'next' where key = 'admin_password'; return jsonb_build_object('ok', true);

  elsif p_op = 'set_staff_pin' then
    if (p->>'next') !~ '^[0-9]{4,8}$' then raise exception 'Le PIN doit contenir 4 à 8 chiffres'; end if;
    update ptp_settings set value = p->>'next' where key = 'staff_pin'; return jsonb_build_object('ok', true);

  elsif p_op = 'stats' then
    return jsonb_build_object(
      'today_orders', (select count(*) from ptp_orders where created_at::date = current_date and status <> 'cancelled'),
      'today_total', (select coalesce(sum(total),0) from ptp_orders where created_at::date = current_date and status = 'served'),
      'open_orders', (select count(*) from ptp_orders where status in ('new','preparing','ready')),
      'week_orders', (select count(*) from ptp_orders where created_at > now() - interval '7 days' and status <> 'cancelled'),
      'items', (select count(*) from ptp_items), 'sections', (select count(*) from ptp_sections),
      'posts', (select count(*) from ptp_posts where active),
      'top', (select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select l->>'name' as name, sum((l->>'qty')::int) as qty
        from ptp_orders o, jsonb_array_elements(o.items) l
        where o.created_at > now() - interval '30 days' and o.status <> 'cancelled'
        group by 1 order by 2 desc limit 5) t)
    );
  end if;
  raise exception 'Opération inconnue : %', p_op;
end $$;
