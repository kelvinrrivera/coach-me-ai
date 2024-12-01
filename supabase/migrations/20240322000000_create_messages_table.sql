-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete cascade,
  content text not null,
  role text not null check (role in ('user', 'assistant')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Create policies
create policy "Users can create their own messages"
  on public.messages for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = user_id);

-- Create indexes
create index messages_user_id_idx on public.messages(user_id);
create index messages_goal_id_idx on public.messages(goal_id);