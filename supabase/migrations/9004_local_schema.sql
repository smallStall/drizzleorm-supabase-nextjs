CREATE ROLE drizzleorm LOGIN PASSWORD 'drizzleormPWD1';

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to drizzleorm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public to drizzleorm;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public to drizzleorm;

