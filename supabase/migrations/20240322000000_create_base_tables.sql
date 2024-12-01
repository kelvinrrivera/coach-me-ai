-- Create goals table if it doesn't exist
create table if not exists public.goals (
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

-- Create milestones table if it doesn't exist
create table if not exists public.milestones (
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

-- Create messages table if it doesn't exist
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete cascade,
  content text not null,
  role text not null check (role in ('user', 'assistant')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.goals enable row level security;
alter table public.milestones enable row level security;
alter table public.messages enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can create their own goals" on public.goals;
drop policy if exists "Users can view their own goals" on public.goals;
drop policy if exists "Users can update their own goals" on public.goals;
drop policy if exists "Users can delete their own goals" on public.goals;

drop policy if exists "Users can create milestones for their goals" on public.milestones;
drop policy if exists "Users can view milestones for their goals" on public.milestones;
drop policy if exists "Users can update milestones for their goals" on public.milestones;
drop policy if exists "Users can delete milestones for their goals" on public.milestones;

drop policy if exists "Users can create their own messages" on public.messages;
drop policy if exists "Users can view their own messages" on public.messages;

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

-- Create policies for messages
create policy "Users can create their own messages"
  on public.messages for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists goals_user_id_idx on public.goals(user_id);
create index if not exists milestones_goal_id_idx on public.milestones(goal_id);
create index if not exists messages_user_id_idx on public.messages(user_id);
create index if not exists messages_goal_id_idx on public.messages(goal_id);