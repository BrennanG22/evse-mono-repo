FROM node:18-bullseye

# Install Supervisor
RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Node.js backend
COPY modbus-app/out /app/modbus-app
COPY modbus-app/node_modules /app/modbus-app/node_modules
COPY modbus-app/package.json /app/modbus-app/package.json
RUN mkdir -p /app/modbus-app/logs

# Copy only built Next.js frontend output
COPY next-app/.next /app/next-app/.next
COPY next-app/package.json /app/next-app/package.json
COPY next-app/node_modules /app/next-app/node_modules
COPY next-app/public /app/next-app/public
COPY next-app/.env.production/ /app/next-app/.env.production

# Copy Supervisor config
COPY docker/supervisord.conf /etc/supervisord.conf

# Expose ports
EXPOSE 3000 2000

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
