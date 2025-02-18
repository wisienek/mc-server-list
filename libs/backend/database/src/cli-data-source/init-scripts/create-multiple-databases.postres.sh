#!/bin/bash

set -e
set -u

su postgres

echo "Logged in as $(whoami)"

function create_user_and_database() {
  local database=$1
  echo "Creating user and database '$database'"

  psql "host=127.0.0.1 port=5432 user=$POSTGRES_USER dbname=postgres" -v ON_ERROR=1 <<-EOSQL
    CREATE DATABASE $database;
EOSQL

    psql "host=127.0.0.1 port=5432 user=$POSTGRES_USER dbname=$database" -v ON_ERROR=1 <<-EOSQL
      GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
  echo "Multiple databases creation requested $POSTGRES_MULTIPLE_DATABASES"

  for db in $(echo "$POSTGRES_MULTIPLE_DATABASES" | tr ',' ' '); do
    create_user_and_database "$db"
  done

  echo "Multiple databases created"
fi
