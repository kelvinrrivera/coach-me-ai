import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const migrationService = {
  async initializeSchema() {
    try {
      // First, create the run_migrations function if it doesn't exist
      const runMigrationsFunctionSQL = `
        create or replace function run_migrations(sql_content text)
        returns void
        language plpgsql
        security definer
        set search_path = public
        as $$
        begin
          execute sql_content;
        exception
          when others then
            raise exception 'Migration failed: %', SQLERRM;
        end;
        $$;

        grant execute on function run_migrations to authenticated;
      `;

      await supabase.rpc('run_migrations', { sql_content: runMigrationsFunctionSQL });

      // Then, run the base schema migration
      const response = await fetch('/supabase/migrations/20240322000003_create_base_schema.sql');
      const schemaSQL = await response.text();

      const { error } = await supabase.rpc('run_migrations', { sql_content: schemaSQL });

      if (error) {
        console.error('Error initializing schema:', error);
        toast.error('Failed to initialize database schema');
        throw error;
      }

      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing schema:', error);
      toast.error('Failed to initialize database schema');
      throw error;
    }
  }
};