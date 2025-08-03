FROM mysql:9.4.0
COPY apps/database .
COPY apps/database/init.sql /docker-entrypoint-initdb.d
RUN chmod +x healthcheck.sh