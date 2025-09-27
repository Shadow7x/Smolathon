#!/bin/sh

echo "PostgreSQL is ready"

cd back

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"