FROM node:16-alpine3.14 AS build
LABEL AUTHOR github.com/famuyiwadayo
WORKDIR /usr/src/app
COPY ./ ./
RUN yarn install
RUN yarn build

# Build Stage 2
# This build takes the production build from staging build
#
FROM node:16-alpine3.14
LABEL AUTHOR github.com/famuyiwadayo
WORKDIR /usr/src/app
COPY package.json package.json
COPY tsconfig.json tsconfig.json

# enabled next line if you want the .env to be built with the images
# note that when doing a CI/CD with githib, the command will fail.
# COPY .env ./ 

COPY --from=build /node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD bun run start