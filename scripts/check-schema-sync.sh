#!/usr/bin/env bash
# Verify that columns in database/migrations/0001_add_cms_fields.sql match
# those in database/schema.sql. Exits 0 if consistent, 1 with a diff otherwise.

set -euo pipefail

SCHEMA="database/schema.sql"
MIGRATION="database/migrations/0001_add_cms_fields.sql"

if [ ! -f "$SCHEMA" ] || [ ! -f "$MIGRATION" ]; then
  echo "ERROR: missing $SCHEMA or $MIGRATION" >&2
  exit 1
fi

# Extract the column names declared in the migration's ALTER TABLE statements.
migration_cols=$(grep -oE 'ADD COLUMN \w+' "$MIGRATION" | awk '{print $3}' | sort -u)
# Extract column names from schema.sql's CREATE TABLE post statement.
schema_cols=$(awk '/CREATE TABLE IF NOT EXISTS post/,/\);/' "$SCHEMA" \
  | grep -oE '^\s{4,}[a-z_]+\s' \
  | awk '{print $1}' \
  | sort -u)

missing=()
for col in $migration_cols; do
  if ! echo "$schema_cols" | grep -qx "$col"; then
    missing+=("$col")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "schema.sql is missing columns declared in 0001 migration: ${missing[*]}" >&2
  echo "Update database/schema.sql CREATE TABLE post to include them." >&2
  exit 1
fi

echo "schema.sql and migrations/0001 are in sync."
