--RLSの設定
DO $$
DECLARE
  sql TEXT := '';
  table_name TEXT;
BEGIN
  FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    sql := sql || 'CREATE POLICY user_policy ON ' || table_name ||
              ' USING (auth.uid() = user_id);';
  END LOOP;
  EXECUTE sql;
  sql := '';
  FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
      sql := sql || 'ALTER TABLE ' || table_name || ' ENABLE ROW LEVEL SECURITY;';
  END LOOP;
  EXECUTE sql;
END;
$$;