# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .
RUN rm -fr node_modules
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install
RUN npm run build:prod

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
COPY env.sh .
COPY default.conf.template /etc/nginx/conf.d

# Make our shell script executable
RUN chmod +x env.sh

EXPOSE 80

# Start Nginx server
CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
