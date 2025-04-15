# Multi-stage build for optimized production image

# Build stage for frontend
FROM node:18 AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build stage for backend
FROM node:18 AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Final production image
FROM node:18-alpine
WORKDIR /app
COPY --from=backend-build /app/server ./server
COPY --from=frontend-build /app/client/build ./server/public

# Install only production dependencies
WORKDIR /app/server
RUN npm install --only=production

# Expose port and start application
EXPOSE 3000
CMD ["node", "app.js"]
