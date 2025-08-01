FROM mysql:9.4.0
COPY apps/database .
RUN chmod +x healthcheck.sh