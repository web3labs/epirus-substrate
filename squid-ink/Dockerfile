FROM node:16-alpine AS node

FROM node:16-alpine AS node-with-gyp
RUN apk add g++ make python3
#RUN npm i -g @subsquid/cli@latest

FROM node-with-gyp AS builder
WORKDIR /squid
ADD commands.json .
ADD package.json .
ADD package-lock.json .
RUN npm ci
ADD tsconfig.json .
ADD src src
RUN npx sqd codegen
RUN npx sqd build

FROM node-with-gyp AS deps
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
RUN npm ci --production

FROM node AS squid
WORKDIR /squid
COPY --from=deps /squid/package.json .
COPY --from=deps /squid/package-lock.json .
COPY --from=deps /squid/node_modules node_modules
COPY --from=builder /squid/src/model src/model
COPY --from=builder /squid/lib lib
ADD db db
ADD schema.graphql .
ADD tsconfig.json .
ADD commands.json .
# TODO: use shorter PROMETHEUS_PORT
ENV PROCESSOR_PROMETHEUS_PORT 3000
EXPOSE 3000
EXPOSE 4000


FROM squid AS processor
#CMD ["npm", "run", "processor:start"]
CMD ["npx", "sqd", "process"]


FROM squid AS query-node
#CMD ["npm", "run", "query-node:start"]
CMD ["npx", "sqd", "serve"]
