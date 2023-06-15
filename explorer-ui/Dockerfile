# Run a production build
FROM node:18-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm config set loglevel error
RUN npm i --silent
RUN npm i react-scripts@5.0.1 -g --silent
COPY . ./
RUN npm run build

# Web server
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# copy .env.example as .env to the release build
# see https://github.com/kHRISl33t/runtime-env-cra for details.
COPY .env.example /usr/share/nginx/html/.env
COPY etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm i runtime-env-cra@0.2.4 -g --silent

WORKDIR /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
