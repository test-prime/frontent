FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder --chown=node:node /home/node/dist/browser /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

