From alpine:3.22
RUN apk add nodejs npm
COPY apps/backend .
RUN npm install
CMD ["npm", "run", "start"]