-- Prep Genie MVP schema (hosted Supabase)

create extension if not exists "pgcrypto";

-- -----------------------------
-- people
-- -----------------------------
create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,

  name text not null,

  daily_kcal int not null check (daily_kcal > 0),
  daily_protein_g int not null check (daily_protein_g >= 0),
  daily_carbs_g int not null check (daily_carbs_g >= 0),
  daily_fat_g int not null check (daily_fat_g >= 0),

  meals_per_day smallint not null check (meals_per_day in (2, 3)),
  clamps jsonb null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists people_account_id_idx on public.people (account_id);

alter table public.people enable row level security;

create policy people_select_own on public.people
  for select
  using (account_id = auth.uid());

create policy people_insert_own on public.people
  for insert
  with check (account_id = auth.uid());

create policy people_update_own on public.people
  for update
  using (account_id = auth.uid())
  with check (account_id = auth.uid());

create policy people_delete_own on public.people
  for delete
  using (account_id = auth.uid());

-- -----------------------------
-- recipes
-- -----------------------------
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,

  version int not null check (version = 1),
  name text not null,
  category text not null check (category in ('protein', 'carb', 'veg', 'extra')),

  nutrition_kcal_per_100g numeric not null check (nutrition_kcal_per_100g >= 0),
  nutrition_protein_g_per_100g numeric not null check (nutrition_protein_g_per_100g >= 0),
  nutrition_carbs_g_per_100g numeric not null check (nutrition_carbs_g_per_100g >= 0),
  nutrition_fat_g_per_100g numeric not null check (nutrition_fat_g_per_100g >= 0),

  yield_factor_cooked_from_raw numeric not null check (yield_factor_cooked_from_raw > 0),

  ingredients_g jsonb not null,
  steps jsonb not null,
  fridge_life_days int not null check (fridge_life_days >= 0),
  notes text not null default '',

  raw_json jsonb not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_account_id_idx on public.recipes (account_id);
create index if not exists recipes_category_idx on public.recipes (account_id, category);
create unique index if not exists recipes_account_name_uidx on public.recipes (account_id, name);

alter table public.recipes enable row level security;

create policy recipes_select_own on public.recipes
  for select
  using (account_id = auth.uid());

create policy recipes_insert_own on public.recipes
  for insert
  with check (account_id = auth.uid());

create policy recipes_update_own on public.recipes
  for update
  using (account_id = auth.uid())
  with check (account_id = auth.uid());

create policy recipes_delete_own on public.recipes
  for delete
  using (account_id = auth.uid());

-- -----------------------------
-- weekly_plans
-- -----------------------------
create table if not exists public.weekly_plans (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,

  week_start_date date not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (account_id, week_start_date)
);

create index if not exists weekly_plans_account_id_week_idx on public.weekly_plans (account_id, week_start_date);

alter table public.weekly_plans enable row level security;

create policy weekly_plans_select_own on public.weekly_plans
  for select using (account_id = auth.uid());

create policy weekly_plans_insert_own on public.weekly_plans
  for insert with check (account_id = auth.uid());

create policy weekly_plans_update_own on public.weekly_plans
  for update using (account_id = auth.uid()) with check (account_id = auth.uid());

create policy weekly_plans_delete_own on public.weekly_plans
  for delete using (account_id = auth.uid());

-- -----------------------------
-- plan_meals
-- -----------------------------
create table if not exists public.plan_meals (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,
  plan_id uuid not null references public.weekly_plans(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,

  date date not null,
  meal_slot text not null check (meal_slot in ('breakfast', 'lunch', 'dinner')),

  protein_recipe_id uuid null references public.recipes(id),
  carb_recipe_id uuid null references public.recipes(id),
  veg_recipe_id uuid null references public.recipes(id),
  extra_recipe_id uuid null references public.recipes(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (plan_id, person_id, date, meal_slot)
);

create index if not exists plan_meals_plan_idx on public.plan_meals (plan_id);
create index if not exists plan_meals_account_date_idx on public.plan_meals (account_id, date);

alter table public.plan_meals enable row level security;

create policy plan_meals_select_own on public.plan_meals
  for select using (account_id = auth.uid());

create policy plan_meals_insert_own on public.plan_meals
  for insert with check (account_id = auth.uid());

create policy plan_meals_update_own on public.plan_meals
  for update using (account_id = auth.uid()) with check (account_id = auth.uid());

create policy plan_meals_delete_own on public.plan_meals
  for delete using (account_id = auth.uid());

-- -----------------------------
-- plan_portions (publish snapshot)
-- -----------------------------
create table if not exists public.plan_portions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,
  plan_id uuid not null references public.weekly_plans(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,

  date date not null,
  meal_slot text not null check (meal_slot in ('breakfast', 'lunch', 'dinner')),
  category text not null check (category in ('protein', 'carb', 'veg', 'extra')),

  grams_cooked int not null check (grams_cooked >= 0),
  is_manual boolean not null default false,
  clamp_applied boolean not null default false,

  kcal numeric not null default 0 check (kcal >= 0),
  protein_g numeric not null default 0 check (protein_g >= 0),
  carbs_g numeric not null default 0 check (carbs_g >= 0),
  fat_g numeric not null default 0 check (fat_g >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (plan_id, person_id, date, meal_slot, category)
);

create index if not exists plan_portions_plan_idx on public.plan_portions (plan_id);

alter table public.plan_portions enable row level security;

create policy plan_portions_select_own on public.plan_portions
  for select using (account_id = auth.uid());

create policy plan_portions_insert_own on public.plan_portions
  for insert with check (account_id = auth.uid());

create policy plan_portions_update_own on public.plan_portions
  for update using (account_id = auth.uid()) with check (account_id = auth.uid());

create policy plan_portions_delete_own on public.plan_portions
  for delete using (account_id = auth.uid());
