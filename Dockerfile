FROM node:16

# Install system dependencies for canvas
RUN apt-get update && apt-get install -y libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

# Set up working directory
WORKDIR /app

# Copy your project files
COPY . .

# Install NPM dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "test.js"]
