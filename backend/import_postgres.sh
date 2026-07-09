#!/usr/bin/env bash
echo "Migrating new Postgres database..."
python manage.py migrate

echo "Loading data from db_backup.json into Postgres..."
python manage.py loaddata db_backup.json
echo "Data successfully imported! Your new Postgres database now has all the old SQLite data."
