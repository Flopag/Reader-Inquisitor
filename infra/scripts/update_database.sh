#!/bin/sh

sudo docker build -t flopag/reader-inquisitor_database:latest -f ../docker/database.Dockerfile ../..
sudo docker push flopag/reader-inquisitor_database:latest

# kubectl set image -n prod deployment/prod-database database=flopag/reader-inquisitor_database:latest