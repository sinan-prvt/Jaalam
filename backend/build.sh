#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
# Backup copies of live sites, shown if this server goes down (websites/snapshots.py)
python manage.py refresh_site_backups
