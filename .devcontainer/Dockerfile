# Builder stage, for building the source code only
FROM node:17.5.0-alpine 
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
