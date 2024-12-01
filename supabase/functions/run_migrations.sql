-- Drop function if it exists
drop function if exists run_migrations(sql_content text);

-- Create the migration function
create or replace function run_migrations(sql_content text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Execute the migration SQL
  execute sql_content;
exception
  when others then
    raise exception 'Migration failed: %', SQLERRM;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function run_migrations to authenticated;