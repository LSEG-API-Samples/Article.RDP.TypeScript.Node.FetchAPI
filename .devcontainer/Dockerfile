# Builder stage, for building the source code only
FROM node:17.5.0-alpine 
LABEL maintainer="Developer Advocate"

# Create app directory
WORKDIR /app

#RUN npm install to update NPM
RUN npm install -g npm@8.7.0 
# Build app
#RUN npm run build

CMD /bin/bash
