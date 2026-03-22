-- Qudrah — Supabase Schema
-- Paste this in Supabase → SQL Editor → Run

-- Profiles
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text,
  role text check (role in ('user', 'coach')) default 'user',
  avatar_url text,
  points integer default 0,
  streak_count integer default 0,
  last_workout_date date,
  created_at timestamptz default now()
);

-- Exercises library
create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text check (muscle_group in ('chest','back','shoulders','arms','legs','core','full_body','cardio')),
  equipment text check (equipment in ('barbell','dumbbell','machine','bodyweight','cable','other')),
  description text,
  created_by uuid references profiles(id),
  is_public boolean default false,
  created_at timestamptz default now()
);

-- Workout templates
create table workouts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  format text check (format in ('routine','challenge')) default 'routine',
  created_by uuid references profiles(id) on delete cascade,
  is_public boolean default false,
  duration_estimate integer,
  created_at timestamptz default now()
);

-- Exercises in a workout
create table workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references workouts(id) on delete cascade,
  exercise_id uuid references exercises(id),
  order_index integer not null,
  sets integer not null default 3,
  reps integer,
  duration_seconds integer,
  weight_kg float,
  rest_seconds integer default 60,
  notes text
);

-- Saved workouts
create table saved_workouts (
  user_id uuid references profiles(id) on delete cascade,
  workout_id uuid references workouts(id) on delete cascade,
  saved_at timestamptz default now(),
  primary key (user_id, workout_id)
);

-- Calendar
create table calendar_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  workout_id uuid references workouts(id) on delete cascade,
  scheduled_date date not null,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- Completed sessions
create table workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  workout_id uuid references workouts(id),
  calendar_entry_id uuid references calendar_entries(id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  duration_seconds integer,
  total_volume_kg float,
  notes text
);

-- Exercise logs per session
create table session_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references workout_sessions(id) on delete cascade,
  exercise_id uuid references exercises(id),
  order_index integer,
  sets_data jsonb not null default '[]'
  -- [{"set": 1, "reps": 10, "weight_kg": 80, "done": true}, ...]
);

-- Badges
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  condition_type text,
  condition_value integer
);

create table user_badges (
  user_id uuid references profiles(id) on delete cascade,
  badge_id uuid references badges(id),
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table saved_workouts enable row level security;
alter table calendar_entries enable row level security;
alter table workout_sessions enable row level security;
alter table session_logs enable row level security;
alter table exercises enable row level security;

create policy "profiles_select" on profiles for select using (true);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

create policy "workouts_select" on workouts for select using (is_public = true or auth.uid() = created_by);
create policy "workouts_insert" on workouts for insert with check (auth.uid() = created_by);
create policy "workouts_update_own" on workouts for update using (auth.uid() = created_by);
create policy "workouts_delete_own" on workouts for delete using (auth.uid() = created_by);

create policy "we_select" on workout_exercises for select using (
  exists (select 1 from workouts w where w.id = workout_id and (w.is_public or w.created_by = auth.uid()))
);
create policy "we_insert" on workout_exercises for insert with check (
  exists (select 1 from workouts w where w.id = workout_id and w.created_by = auth.uid())
);
create policy "we_update" on workout_exercises for update using (
  exists (select 1 from workouts w where w.id = workout_id and w.created_by = auth.uid())
);
create policy "we_delete" on workout_exercises for delete using (
  exists (select 1 from workouts w where w.id = workout_id and w.created_by = auth.uid())
);

create policy "exercises_select" on exercises for select using (is_public = true or auth.uid() = created_by);
create policy "exercises_insert" on exercises for insert with check (auth.uid() = created_by);

create policy "saved_select" on saved_workouts for select using (auth.uid() = user_id);
create policy "saved_insert" on saved_workouts for insert with check (auth.uid() = user_id);
create policy "saved_delete" on saved_workouts for delete using (auth.uid() = user_id);

create policy "cal_select" on calendar_entries for select using (auth.uid() = user_id);
create policy "cal_insert" on calendar_entries for insert with check (auth.uid() = user_id);
create policy "cal_update" on calendar_entries for update using (auth.uid() = user_id);
create policy "cal_delete" on calendar_entries for delete using (auth.uid() = user_id);

create policy "sessions_select" on workout_sessions for select using (auth.uid() = user_id);
create policy "sessions_insert" on workout_sessions for insert with check (auth.uid() = user_id);
create policy "sessions_update" on workout_sessions for update using (auth.uid() = user_id);

create policy "logs_select" on session_logs for select using (
  exists (select 1 from workout_sessions s where s.id = session_id and s.user_id = auth.uid())
);
create policy "logs_insert" on session_logs for insert with check (
  exists (select 1 from workout_sessions s where s.id = session_id and s.user_id = auth.uid())
);

-- ─── Auto-create profile on signup ───────────────────────────────────────────

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Seed data ────────────────────────────────────────────────────────────────

insert into exercises (name, muscle_group, equipment, is_public) values
  ('Développé couché', 'chest', 'barbell', true),
  ('Squat barre', 'legs', 'barbell', true),
  ('Tractions', 'back', 'bodyweight', true),
  ('Pompes', 'chest', 'bodyweight', true),
  ('Soulevé de terre', 'back', 'barbell', true),
  ('Dips', 'arms', 'bodyweight', true),
  ('Curl haltères', 'arms', 'dumbbell', true),
  ('Presse à cuisses', 'legs', 'machine', true),
  ('Gainage', 'core', 'bodyweight', true),
  ('Développé militaire', 'shoulders', 'barbell', true);

insert into badges (name, description, icon, condition_type, condition_value) values
  ('Premier Pas', 'Première séance complétée', '🏁', 'sessions_count', 1),
  ('Semaine de Feu', '7 jours de streak', '🔥', 'streak', 7),
  ('Régulier', '30 séances au total', '💪', 'sessions_count', 30),
  ('Centurion', '100 séances au total', '⚡', 'sessions_count', 100),
  ('Tonnage', '10 000 kg de volume total', '🏋️', 'volume', 10000);
