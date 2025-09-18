#!/bin/sh

if curl --fail http://localhost:$PORT/health; then
    echo "server responding"
    exit 0
else
    echo "server not responding"
    exit 1
fi
