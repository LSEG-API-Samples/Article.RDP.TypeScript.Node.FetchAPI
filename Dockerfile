# Builder stage, for building the source code only
ARG NODE_VERSION=24.13.0
#ARG VARIANT=bookworm
ARG VARIANT=alpine3.23
FROM docker.io/node:${NODE_VERSION}-${VARIANT} as builder
LABEL maintainer="Developer Advocate"

# Create app directory
WORKDIR /app

# Install app dependencies and build configurations
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json .
COPY tsconfig.json .
# Copy source
COPY src ./src
#RUN npm install in LSEG environment
RUN npm config set strict-ssl false\
    && npm config set registry http://registry.npmjs.org/ \
    && npm install -g npm@8.7.0 \
    && npm ci \
    && npm cache clean --force

#RUN npm install in Your environment that not blocks NPM registry.
#RUN npm install -g npm@8.7.0 \
#    && npm ci \
#    && npm cache clean --force

# Build app
RUN npm run build-minify

## Second stage, for running the application in a final image.

FROM node:${NODE_VERSION}-${VARIANT}

# Create app directory
WORKDIR /app

# Set ENV Production 

ENV NODE_ENV production

#COPY configuration files
COPY --from=builder /app/package*.json .
COPY --from=builder /app/tsconfig.json .

#RUN npm install with Production flag
RUN npm config set strict-ssl false\
    && npm config set registry http://registry.npmjs.org/ \
    && npm install -g npm@8.7.0 \
    && npm ci --production\
    && npm cache clean --force

#RUN npm install in Your environment that not blocks NPM registry.
#RUN npm install -g npm@8.7.0 \
#    && npm ci --production\
#    && npm cache clean --force

# Copy the bundle file and run script
COPY --from=builder /app/dist ./dist
# Set Docker to run the application with compress mode

ENTRYPOINT [ "node", "./dist/rdp_nodefetch.min.js"]
# For un-compress code
#ENTRYPOINT [ "node", "./dist/rdp_nodefetch.js"]
#For Node 17.5.0
#ENTRYPOINT [ "node", "--experimental-fetch", "./dist/rdp_nodefetch.js"]

