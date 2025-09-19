FROM node:24-alpine
WORKDIR /home
COPY apps/bot .
RUN npm install
RUN apk add curl
RUN apk add python3
RUN apk add py3-pip
RUN python3 -m venv /opt/venv \
 && source /opt/venv/bin/activate \
 && pip install --upgrade pip \
 && pip install -r requirements.txt
ENV PATH="/opt/venv/bin:$PATH"
RUN chmod +x healthcheck.sh
RUN chmod +x test.sh