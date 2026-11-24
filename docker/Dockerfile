FROM node:22-alpine AS dependencies

WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci

FROM dependencies AS development

COPY web/index.html web/vite.config.ts web/tsconfig*.json ./
COPY web/src ./src
COPY web/public ./public

EXPOSE 4173
CMD ["npm", "run", "dev:docker"]

FROM development AS build
RUN npm run build

FROM nginx:stable-alpine AS production
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
