# Use an official lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start Vite dev server accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]
