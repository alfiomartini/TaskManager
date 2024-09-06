FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app (if necessary)
# RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD [ "npm", "run", "dev" ] 
