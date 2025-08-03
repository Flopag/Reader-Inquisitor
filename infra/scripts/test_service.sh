#!/bin/sh

app_name=reader_inquisitor
service_name=$1

if [ -z "$service_name" ]; then
  echo "Usage: $0 <service_name>"
  exit 1
fi

docker build -t test-${app_name}/${service_name} -f ../docker/${service_name}.Dockerfile ../..

echo "============================================"

docker run --name test-${app_name}_${service_name} test-${app_name}/${service_name} /home/test.sh
exit_code=$?

echo "============================================"

docker rm test-${app_name}_${service_name}

docker rmi test-${app_name}/${service_name}

echo "Test exited with code: $exit_code"

exit $exit_code