# Deployment Instructions

This application is ready to be deployed to production environments. Below is the recommended deployment strategy.

## 1. Backend Deployment (Render / Railway / GCP)

The backend is built with Django and requires a WSGI/ASGI server (like Gunicorn) and a PostgreSQL database.

### Using Docker (Recommended)
A `Dockerfile` and `docker-compose.yml` are provided.
1. Deploy to any Docker-compatible host (e.g., Render, Railway, AWS ECS, DigitalOcean App Platform).
2. Set the following Environment Variables in your hosting dashboard:
    - `SECRET_KEY` (Generate a secure random string)
    - `DEBUG=False`
    - `ALLOWED_HOSTS=your-api-domain.com`
    - `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com`
    - `USE_POSTGRES=True`
    - `DATABASE_URL` (Provided by your managed DB provider)
    - `GOOGLE_CLIENT_ID`
3. Run the migrations during the build/release phase: `python manage.py migrate`.

### Using standard PaaS (e.g., Heroku, PythonAnywhere)
1. Push the `backend/` code.
2. Set your build command to: `pip install -r requirements.txt`
3. Set your start command to: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

---

## 2. Frontend Deployment (Vercel / Netlify / Firebase Hosting)

The frontend is a static React Single Page Application built with Vite.

1. Connect your GitHub repository to Vercel or Netlify.
2. Configure the build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `frontend`
3. Set the Environment Variables:
   - `VITE_API_URL=https://your-api-domain.com/api`
   - `VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com`
4. Deploy!

### CORS and Environments
Ensure that your backend `CORS_ALLOWED_ORIGINS` strictly includes the exact HTTPS URL of your deployed frontend.
