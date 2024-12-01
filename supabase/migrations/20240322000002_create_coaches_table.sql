-- Create coaches table
create table if not exists public.coaches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete cascade not null,
  assistant_id text not null,
  name text not null,
  expertise text[] not null,
  personality text not null,
  coaching_style text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(goal_id)
);

-- Create coach_messages table
create table if not exists public.coach_messages (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  content text not null,
  role text not null check (role in ('user', 'coach')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.coaches enable row level security;
alter table public.coach_messages enable row level security;

-- Create policies for coaches
create policy "Users can create their own coaches"
  on public.coaches for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own coaches"
  on public.coaches for select
  using (auth.uid() = user_id);

create policy "Users can update their own coaches"
  on public.coaches for update
  using (auth.uid() = user_id);

create policy "Users can delete their own coaches"
  on public.coaches for delete
  using (auth.uid() = user_id);

-- Create policies for coach messages
create policy "Users can create messages for their coaches"
  on public.coach_messages for insert
  with check (
    exists (
      select 1 from public.coaches
      where id = coach_id and user_id = auth.uid()
    )
  );

create policy "Users can view messages from their coaches"
  on public.coach_messages for select
  using (
    exists (
      select 1 from public.coaches
      where id = coach_id and user_id = auth.uid()
    )
  );

-- Create indexes
create index if not exists coaches_user_id_idx on public.coaches(user_id);
create index if not exists coaches_goal_id_idx on public.coaches(goal_id);
create index if not exists coach_messages_coach_id_idx on public.coach_messages(coach_id);