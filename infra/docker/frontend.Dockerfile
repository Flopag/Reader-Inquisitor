FROM node:24-alpine
WORKDIR /home
COPY apps/frontend .
RUN npm install
CMD ["npm", "run", "start"]