FROM node:24-alpine
WORKDIR /home
COPY apps/discord .
RUN npm install
RUN apk add curl
RUN chmod +x healthcheck.sh
RUN chmod +x test.sh