# Set base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/app

# Copy "package.json" and "yarn.lock" before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json yarn.lock ./

# Install dependencies with yarn
RUN yarn install

# Copy all files
COPY ./ ./

# Build app
RUN yarn build

# Expose the listening port
EXPOSE 3000

# Run the app in production mode
CMD ["yarn", "start"]