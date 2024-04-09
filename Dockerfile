# Use the official Node.js image as the base
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Set the environment variables
ENV DEV_DATABASE_URL=postgres://postgres:thestunna420@localhost:5432/Events
ENV JWT_SECRET=Faid&Ivan2024

# Expose the port your NestJS app is running on (default is 3000)
EXPOSE 3000

# Start the NestJS application
CMD [ "npm", "run", "start:prod" ]