# Deployment Guide

This guide covers deploying the CallMissed AI Studio to various production environments.

## Prerequisites
- A valid `CALLMISSED_API_KEY`.
- Node.js environment (v18+ recommended).

## Environment Variables
In your production hosting provider, you must set the following environment variables:
- `NODE_ENV=production`
- `CALLMISSED_API_KEY=<your_api_key>`
- `PORT=3000` (Or whichever port your provider defaults to).

## Deploying to Vercel

Since this project utilizes Next.js App Router with Serverless Route Handlers, it is natively designed for deployment on Vercel.

1. **Push your code to GitHub.**
2. **Import your repository in Vercel.**
3. **Configure Environment Variables:** Add `CALLMISSED_API_KEY`.
4. **Deploy:** Vercel will automatically detect Next.js and configure the build settings.

## Deploying to Google Cloud Run (Docker)

If you prefer containerized deployment, you can deploy to Google Cloud Run or similar platforms.

1. **Build the application:**
   The `npm run build` command generates the optimized Next.js production build in the `.next` directory.

2. **Start the server:**
   The production server is booted using `npm start` (which runs `next start`).

### Dockerfile Example
If you are deploying via Docker, a standard Node.js Dockerfile works perfectly:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Render / Railway / Heroku
Next.js applications can be deployed easily to Render, Railway, or Heroku by specifying the Node environment, adding the environment variables, and ensuring the start command is `next start`.
