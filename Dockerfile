FROM node:22 AS redhat
#RUN dnf -y install nodejs@22
#RUN adduser node
#USER node
#WORKDIR /home/node
#RUN mkdir app
COPY . /home/node