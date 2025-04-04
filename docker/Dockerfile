FROM node:latest

# Install Supervisor
RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy data for initialization or recovery
COPY docker/init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh
COPY docker/initData initData

# Copy Node.js backend
COPY modbus-app/out /app/modbus-app
COPY modbus-app/node_modules /app/modbus-app/node_modules
COPY modbus-app/package.json /app/modbus-app/package.json
COPY modbus-app/src/.env.production /app/modbus-app/.env
RUN mkdir -p /app/modbus-app/logs

# Copy only built Next.js frontend output
COPY next-app/.next /app/next-app/.next
COPY next-app/package.json /app/next-app/package.json
COPY next-app/node_modules /app/next-app/node_modules
COPY next-app/public /app/next-app/public
COPY next-app/.env.production /app/next-app/.env

# Copy Supervisor config
COPY docker/supervisord.conf /etc/supervisord.conf

# Create a custom entrypoint script
COPY docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && \
    sed -i 's/\r$//' /usr/local/bin/init.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/init.sh

# Expose ports
EXPOSE 3000 2000

# Add control environment variable with default
ENV RUN_INIT_SCRIPT=${RUN_INIT_SCRIPT:-"false"}

# Use the custom entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Start Supervisor (will be executed by entrypoint)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]