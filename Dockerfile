# Builder stage, for building the source code only
FROM node:17.5.0-alpine as builder
LABEL maintainer="Developer Advocate"

# Create app directory
WORKDIR /app

# Install app dependencies and build configurations
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json .
COPY tsconfig.json .

# Copy source
COPY code ./code
#RUN npm install
RUN npm install -g npm@8.7.0 \
    && npm install \
    && npm cache clean --force
# Build app
RUN npm run build

## Second stage, for running the application in a final image.

FROM node:17.5.0-alpine

# Create app directory
WORKDIR /app
# Copy the bundle file and run script
COPY --from=builder /app/dist ./dist

ENTRYPOINT [ "node", "--experimental-fetch", "./dist/rdp_nodefetch.js"]
#ENTRYPOINT [ "node" ,"./dist/testYargs.js""]
# Set Docker to start bash
#CMD /bin/bash
