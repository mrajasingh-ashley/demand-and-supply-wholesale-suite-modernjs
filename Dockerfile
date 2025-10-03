# --- Stage 1: The "Builder" ---
# This stage installs dependencies and builds the React application.
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker's layer caching.
# If these files don't change, Docker won't reinstall dependencies on every build.
COPY package*.json ./

# Use 'npm ci' in pipelines. It's faster and more reliable than 'npm install'.
RUN npm ci

# Copy the rest of your application's source code.
COPY . .

# Build the application. This creates the generic, environment-agnostic static files.
RUN npm run build


# --- Stage 2: The Final "Production" Image ---
# This stage creates the final, lightweight image that will be deployed.
FROM nginx:alpine

# Copy the static files built in the 'builder' stage into the Nginx web root.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our new entrypoint script into the final image.
COPY ./entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable.
RUN chmod +x /entrypoint.sh

# Set the entrypoint. This is the command that will run when the container starts.
ENTRYPOINT ["/entrypoint.sh"]
