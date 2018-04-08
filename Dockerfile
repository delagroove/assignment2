FROM python:3.5

RUN apt-get update && apt-get install -y gcc musl git imagemagick wget libxml2 libxml2-dev

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
#

# Define mountable directories.
VOLUME ["/usr/src/app/"]

# Define default command.


RUN \
  git clone https://github.com/delagroove/assignment2.git /usr/src/app/assignment2

ENTRYPOINT ["python"]
CMD cd /usr/src/app/assignment2
CMD FLASK_APP=server.py flask run
