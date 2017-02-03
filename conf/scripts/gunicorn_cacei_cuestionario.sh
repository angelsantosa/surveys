#!/bin/bash

# Exits as soon as any line in the bash script fails
set -e

# As a rule-of-thumb set the --workers (NUM_WORKERS) according to the following formula: 2 * CPUs + 1. 
# The idea being, that at any given time half of your workers will be busy doing I/O. 
# For a single CPU machine it would give you 3.

NAME="cacei_cuestionario"                                        # Name of the application
VIRTUALENV_NAME=$(echo ${NAME}|tr '_' '-')                       # Name of virtualenv
DJANGODIR=/srv/webapps/${NAME}                                   # Django project directory
SOCKFILE=/srv/webapps/${NAME}/conf/var/run/gunicorn.sock         # we will communicte using this unix socket
SOURCEFILE=../.virtualenvs/${VIRTUALENV_NAME}/bin/activate       # load python enviroment
USER=caceiapps                                                   # the user to run as
GROUP=caceiapps                                                  # the group to run as
NUM_WORKERS=3                                                    # how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=${NAME}.settings.production               # which settings file should Django use
DJANGO_WSGI_MODULE=${NAME}.wsgi                                  # WSGI module name

# MAX_REQUESTS=1                                                 # reload the application server for each request

echo "Starting $NAME as $(whoami)"

# Activate the virtual environment
cd $DJANGODIR
source $SOURCEFILE
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec $(which gunicorn) ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level=error \
  --log-file=-

# Extra options
# --max-requests $MAX_REQUESTS \
# --log-level=debug \
# --bind=0.0.0.0:8000 \
