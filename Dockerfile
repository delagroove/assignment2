FROM python:3-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash wget ca-certificates openssl git openssh

WORKDIR /usr/src/app

RUN pip install terminaltables
RUN pip install beautifulsoup4
RUN pip install requests

#ADD repo-key /

# Make ssh dir
RUN mkdir /root/.ssh/

# Copy over private key, and set permissions
RUN chown -R root:root /root/.ssh

# Create known_hosts
RUN touch /root/.ssh/known_hosts


# Remove host checking
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

RUN \
#  chmod 600 /repo-key && \
#  echo "IdentityFile /repo-key" >> /etc/ssh/ssh_config && \
#  echo -e "StrictHostKeyChecking no" >> /etc/ssh/ssh_config && \
  git clone https://github.com/delagroove/assignment1.git /usr/src/app/assignment1

CMD [ "python", "/usr/src/app/assignment1/main.py" ]
