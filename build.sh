# Hostinger-specific build configuration

# This tells Hostinger to use a clean npm install
npm ci || npm install --legacy-peer-deps

# Build the application
npm run build
