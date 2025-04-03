# Use the official Node.js image as the base image
FROM node:22-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Development Stage
FROM base AS dev

# Command to open the container shell
# CMD ["yarn", "start:dev"]

# Production Stage
FROM base AS production

# Build the NestJS application
RUN yarn build

# Command to run the application
CMD ["yarn", "start:prod"]


