#!/bin/bash

# Run the command and capture the output
output=$(npx supabase status)

# Extract values from the output
supabase_url=$(echo "$output" | grep "API URL:" | awk '{print $3}')
anon_key=$(echo "$output" | grep "anon key:" | awk '{print $3}')
db_host=$(echo "$output" | grep "DB URL:" | awk -F@ '{print $NF}' | awk -F: '{print $1}')
db_port=$(echo "$output" | grep "DB URL:" |awk -F: '{print $NF}' | awk -F/ '{print $1}')
db_name=$(echo "$output" | grep "DB URL:" | awk -F/ '{print $4}')
db_user="drizzleorm"
db_pass="drizzleormPWD1"

# Generate the .env.test file
cat <<EOF > .env.test
SUPABASE_URL=$supabase_url
SUPABASE_ANON_KEY=$anon_key
DATABASE_HOST=$db_host
PGBOUNCER_PORT= ${db_port/%?/}9
DATABASE_NAME=$db_name
DATABASE_USER=$db_user
DATABASE_PASSWORD=$db_pass
EOF

echo ".env.test file generated."