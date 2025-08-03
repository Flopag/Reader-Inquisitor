FROM node:24-alpine
WORKDIR /home
COPY apps/frontend .
RUN npm install
RUN chmod +x healthcheck.sh
RUN chmod +x test.sh