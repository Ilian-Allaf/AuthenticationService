# Use the official Node.js image as the base image
FROM node:20.10.0

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY . .

RUN npm install

# Build the TypeScript code
RUN npm run build

# Expose the port on which your application will run
# EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]
