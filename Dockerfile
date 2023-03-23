# FROM node:16-alpine3.14 AS build
# LABEL AUTHOR github.com/famuyiwadayo
# WORKDIR /usr/src/app
# COPY ./ ./
# RUN yarn install
# RUN yarn build

FROM jarredsumner/bun:edge AS build
LABEL AUTHOR github.com/famuyiwadayo
WORKDIR /app
# COPY package.json package.json
# COPY bun.lockb bun.lockb
COPY ./ ./
RUN bun install
RUN bun run build
# COPY . .

# Build Stage 2
# This build takes the production build from staging build
#
FROM jarredsumner/bun:edge
LABEL AUTHOR github.com/famuyiwadayo
WORKDIR /app
COPY package.json package.json
COPY tsconfig.json tsconfig.json

# enabled next line if you want the .env to be built with the images
# note that when doing a CI/CD with githib, the command will fail.
# COPY .env ./ 

COPY --from=build /node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD bun run start