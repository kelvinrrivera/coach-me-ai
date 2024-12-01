-- Drop existing tables if they exist
drop table if exists public.coach_messages;
drop table if exists public.coaches;
drop table if exists public.messages;
drop table if exists public.milestones;
drop table if exists public.goals;

-- Create goals table
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null,
  target_date date not null,
  status text not null default 'not_started',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint status_values check (status in ('not_started', 'in_progress', 'completed')),
  constraint category_values check (category in ('personal', 'professional', 'health', 'education'))
);

-- Create milestones table
create table public.milestones (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  title text not null,
  description text,
  due_date date not null,
  status text not null default 'pending',
  evidence_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint status_values check (status in ('pending', 'completed'))
);

-- Create coaches table
create table public.coaches (
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
create table public.coach_messages (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  content text not null,
  role text not null check (role in ('user', 'coach')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.goals enable row level security;
alter table public.milestones enable row level security;
alter table public.coaches enable row level security;
alter table public.coach_messages enable row level security;

-- Create policies for goals
create policy "Users can create their own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- Create policies for milestones
create policy "Users can create milestones for their goals"
  on public.milestones for insert
  with check (
    exists (
      select 1 from public.goals
      where id = goal_id and user_id = auth.uid()
    )
  );

create policy "Users can view milestones for their goals"
  on public.milestones for select
  using (
    exists (
      select 1 from public.goals
      where id = goal_id and user_id = auth.uid()
    )
  );

create policy "Users can update milestones for their goals"
  on public.milestones for update
  using (
    exists (
      select 1 from public.goals
      where id = goal_id and user_id = auth.uid()
    )
  );

create policy "Users can delete milestones for their goals"
  on public.milestones for delete
  using (
    exists (
      select 1 from public.goals
      where id = goal_id and user_id = auth.uid()
    )
  );

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
create index goals_user_id_idx on public.goals(user_id);
create index milestones_goal_id_idx on public.milestones(goal_id);
create index coaches_user_id_idx on public.coaches(user_id);
create index coaches_goal_id_idx on public.coaches(goal_id);
create index coach_messages_coach_id_idx on public.coach_messages(coach_id);