# [Credits]
# Reference from the instructions at https://docusaurus.community/knowledge/deployment/docker/
# Grateful to [Cindy Le](https://dev.to/cindyledev/) and [BillChirico of Volvox LLC](https://github.com/BillChirico) for sharing their experience dockerizing Docusaurus sites.

# Stage 1: Base image.
## Start with a base image containing NodeJS so we can build Docusaurus.
FROM node:lts as base
## Disable colour output from yarn to make logs easier to read.
ENV FORCE_COLOR=0
## Enable corepack.
RUN corepack enable
## Set the working directory to `/opt/website`.
WORKDIR /opt/website

# Stage 2a: Development mode.
FROM base as dev
## Set the working directory to `/opt/website`.
WORKDIR /opt/website
## Expose the port that website will run on.
EXPOSE 3006
## Run the development server.
# CMD [ -d "node_modules" ] && npm run start --host 0.0.0.0 --poll 1000 || npm run install && npm run start --host 0.0.0.0 --poll 1000

# Stage 2b: Production build mode.
FROM base as prod
## Set the working directory to `/opt/website`.
WORKDIR /opt/website
## Copy over the source code.
COPY . /opt/website/
## Install dependencies with `--immutable` to ensure reproducibility.
RUN npm ci
## Build the static site.
RUN npm run build

# Stage 3a: Serve with `website serve`.
FROM prod as serve
## Expose the port that website will run on.
EXPOSE 3006
## Run the production server.
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--no-open"]

# Stage 3b: Serve with Caddy.
FROM caddy:2-alpine as caddy
## Copy the Caddyfile.
COPY --from=prod /opt/website/Caddyfile /etc/caddy/Caddyfile
## Copy the website build output.
COPY --from=prod /opt/website/build /var/website