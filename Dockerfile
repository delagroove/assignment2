FROM python:3-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash wget ca-certificates openssl git openssh

WORKDIR /usr/src/app


COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
#

# INFO ABOUT INSTALLING MONGO DB
RUN apk add mongodb --update-cache --repository http://dl-4.alpinelinux.org/alpine/edge/testing --allow-untrusted && \
	rm -rf /var/cache/apk/*

# Create dbdata path
RUN mkdir -p /data/db

# Define mountable directories.
VOLUME ["/data/db"]

# Define default command.
CMD ["mongod"]

EXPOSE 27017

RUN mongo --eval "db.getSiblingDB('crypto').createUser({'user':'admin', 'pwd':'admin','roles':['readWrite']});db.getSiblingDB('crypto').createCollection('orders');db.getSiblingDB('crypto').createCollection('settings');"
RUN mongo --eval "db.getSiblingDB('crypto').settings.insert({cash: 100000000})"


RUN \
#  chmod 600 /repo-key && \
#  echo "IdentityFile /repo-key" >> /etc/ssh/ssh_config && \
#  echo -e "StrictHostKeyChecking no" >> /etc/ssh/ssh_config && \
  git clone https://github.com/delagroove/assignment2.git /usr/src/app/assignment2

CMD ["FLASK_APP=/usr/src/app/assignment2/server.py flask run"]
