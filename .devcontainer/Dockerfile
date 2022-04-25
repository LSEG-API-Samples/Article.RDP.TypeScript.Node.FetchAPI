# Dockerfile for the devcontainer
# Builder stage, for building the source code only
ARG NODE_VERSION=18.0.0
ARG VARIANT=bullseye
FROM node:${NODE_VERSION}-${VARIANT}

LABEL maintainer="Developer Advocate"

# Create app directory
WORKDIR /app

# Update packages and install git 
RUN apt-get update \
    && apt install git -y \
    && apt-get clean

#RUN npm install to update NPM
RUN npm install -g npm@8.7.0 

#Run default shell
#CMD ["/bin/sh"]
CMD ["/bin/bash"]
