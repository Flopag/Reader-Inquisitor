FROM node:24-alpine
WORKDIR /home
COPY apps/backend .
RUN npm install