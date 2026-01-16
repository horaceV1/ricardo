# Hostinger Deployment Configuration

## Build Command
npm install && npm run build

## Start Command  
npm start

## Environment Variables (Set in Hostinger Panel)
NEXT_PUBLIC_DRUPAL_BASE_URL=https://ricardo.ddev.site:33002
NEXT_IMAGE_DOMAIN=ricardo.ddev.site
NODE_ENV=production

## Port
The application will run on the port assigned by Hostinger (usually 3000)

## Node Version
Recommended: 20.x or higher

## Troubleshooting

If you get "Cannot find module '../server/require-hook'" error:
1. Delete node_modules and package-lock.json
2. Run: npm install
3. Run: npm run build

Commands:
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build
```
