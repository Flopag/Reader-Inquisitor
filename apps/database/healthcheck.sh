#!/bin/sh

if mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD; then
    echo "server responding"
    exit 0
else
    echo "server not responding"
    exit 1
fi
