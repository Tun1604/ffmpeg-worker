# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN apt-get update && apt-get install -y ffmpeg

 

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]

