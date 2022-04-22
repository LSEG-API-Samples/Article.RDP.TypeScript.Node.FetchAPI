# Builder stage, for building the source code only
ARG NODE_VERSION=17.5.0
ARG VARIANT=alpine3.15
FROM node:${NODE_VERSION}-${VARIANT}

LABEL maintainer="Developer Advocate"

# Create app directory
WORKDIR /app

# Update packages and install git
RUN apk update \
    && apk add --no-cache git 

#RUN npm install to update NPM
RUN npm install -g npm@8.7.0 

#Run default shell
CMD ["/bin/sh"]
