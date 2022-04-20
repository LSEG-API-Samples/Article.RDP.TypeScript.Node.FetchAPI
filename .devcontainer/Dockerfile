# Builder stage, for building the source code only
FROM node:17.5.0-alpine 
LABEL maintainer="Developer Advocate"

# Create app directory
WORKDIR /app

RUN apk update \
    && apk add --no-cache git \
    && apk add --no-cache fish 

#RUN npm install to update NPM
RUN npm install -g npm@8.7.0 

# Set Fish Shell

RUN sed -i -e "s/bin\/ash/usr\/bin\/fish/" /etc/passwd
ENV SHELL /usr/bin/fish

#CMD ["/bin/sh"]
CMD ["fish"]
