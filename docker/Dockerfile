FROM node:22-alpine AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS development

COPY index.html vite.config.ts tsconfig*.json ./
COPY src ./src
COPY public ./public

EXPOSE 4173
CMD ["npm", "run", "dev:docker"]

FROM development AS build
RUN npm run build

FROM nginx:stable-alpine AS production
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
