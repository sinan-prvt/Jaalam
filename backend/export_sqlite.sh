    #!/usr/bin/env bash
echo "Exporting data from local SQLite database..."
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission -e admin.logentry --indent 4 > db_backup.json
echo "Data successfully exported to db_backup.json!"
echo "Now, set your DATABASE_URL environment variable to your new Postgres database, run migrations, and then run import_postgres.sh"
