FROM node:24-alpine
WORKDIR /home
COPY apps/backend .
RUN npm install
RUN apk add curl
RUN chmod +x healthcheck.sh
RUN chmod +x test.sh

# Chromium configuration form 
# https://pptr.dev/troubleshooting#running-on-alpine

# Installs Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium