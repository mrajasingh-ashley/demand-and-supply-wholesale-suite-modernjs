# --- Stage 1: The "Builder" ---
# This stage builds the React application, creating the final static assets.
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: The Final "Production" Image ---
# This stage creates a small, secure Nginx image to serve the built files.
FROM nginx:alpine

# The Nginx web server's root directory is /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Clean out the default Nginx placeholder content
RUN rm -rf ./*

# The following commands precisely copy the built files into the locations
# where Nginx expects to find them.

# 1. Copy the 'static' folder (which contains all your CSS, JS, etc.)
COPY --from=builder /app/dist/static ./static

# 2. Copy the 'index.html' file from its nested directory to the web root.
COPY --from=builder /app/dist/html/main/index.html .

# 3. Copy the runtime 'config.json' file to the web root so it can be fetched.
COPY --from=builder /app/dist/config.json .

# 4. Copy and set up our entrypoint script for runtime configuration.
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# This tells the container to run our script before starting the web server.
ENTRYPOINT ["/entrypoint.sh"]
