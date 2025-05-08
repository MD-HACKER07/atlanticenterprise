# Atlantic Enterprise Deployment Guide for Hostinger VPS

This guide provides step-by-step instructions for deploying both the frontend and backend of Atlantic Enterprise on a Hostinger VPS using Nginx.

## Prerequisites

- A Hostinger VPS with:
  - Ubuntu 20.04 or newer
  - Minimum 2GB RAM
  - 2 CPU cores
  - 40GB SSD storage
- A domain name (atlanticenterprise.in) with DNS pointing to your VPS IP
- SSH access to your VPS
- Knowledge of basic Linux commands

## 1. Initial Server Setup

### Connect to Your VPS

```bash
ssh root@your-vps-ip
```

### Create a Non-Root User (Optional but Recommended)

```bash
adduser atlantic
usermod -aG sudo atlantic
su - atlantic
```

### Update System and Install Dependencies

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git build-essential nginx certbot python3-certbot-nginx ufw
```

### Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Install Node.js and npm

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### Install PM2 for Process Management

```bash
sudo npm install -g pm2
```

## 2. Prepare Deployment Files

### Create Directory Structure

```bash
sudo mkdir -p /var/www/atlanticenterprise/{frontend,api,logs,scripts}
sudo chown -R $USER:$USER /var/www/atlanticenterprise
```

### Create Deployment Script

Create a file at `/var/www/atlanticenterprise/scripts/deploy.sh`:

```bash
#!/bin/bash

# Deployment script for Atlantic Enterprise
# Usage: ./deploy.sh [frontend|backend|both]

FRONTEND_DIR="/var/www/atlanticenterprise/frontend"
BACKEND_DIR="/var/www/atlanticenterprise/api"
LOGS_DIR="/var/www/atlanticenterprise/logs"

# Create logs directory if it doesn't exist
mkdir -p $LOGS_DIR

# Function to deploy frontend
deploy_frontend() {
  echo "Deploying frontend..."
  
  # Backup current frontend if it exists
  if [ -d "$FRONTEND_DIR" ]; then
    BACKUP_DIR="${FRONTEND_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
    echo "Backing up current frontend to $BACKUP_DIR"
    cp -r $FRONTEND_DIR $BACKUP_DIR
  fi
  
  # Clear frontend directory
  rm -rf $FRONTEND_DIR/*
  
  # Extract frontend files from uploaded archive
  echo "Extracting frontend files..."
  unzip -q /tmp/frontend.zip -d $FRONTEND_DIR
  
  echo "Frontend deployment completed"
}

# Function to deploy backend
deploy_backend() {
  echo "Deploying backend..."
  
  # Backup current backend if it exists
  if [ -d "$BACKEND_DIR" ]; then
    BACKUP_DIR="${BACKEND_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
    echo "Backing up current backend to $BACKUP_DIR"
    cp -r $BACKEND_DIR $BACKUP_DIR
  fi
  
  # Extract backend files from uploaded archive
  echo "Extracting backend files..."
  unzip -q /tmp/backend.zip -d $BACKEND_DIR
  
  # Install dependencies
  echo "Installing dependencies..."
  cd $BACKEND_DIR
  npm install --production
  
  # Restart the API service
  echo "Restarting API service..."
  pm2 restart atlantic-api || pm2 start api-server.js --name "atlantic-api"
  pm2 save
  
  echo "Backend deployment completed"
}

# Main execution
case "$1" in
  frontend)
    deploy_frontend
    ;;
  backend)
    deploy_backend
    ;;
  both)
    deploy_frontend
    deploy_backend
    ;;
  *)
    echo "Usage: $0 [frontend|backend|both]"
    exit 1
    ;;
esac

echo "Deployment completed successfully!"
```

Make it executable:

```bash
chmod +x /var/www/atlanticenterprise/scripts/deploy.sh
```

### Create Monitoring Script

Create a file at `/var/www/atlanticenterprise/scripts/monitor.sh`:

```bash
#!/bin/bash

# Variables
LOG_FILE="/var/www/atlanticenterprise/logs/monitor.log"
API_ENDPOINT="http://localhost:3005/api/health"
FRONTEND_URL="https://atlanticenterprise.in"

# Log function
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Check if API is running
check_api() {
  response=$(curl -s -o /dev/null -w "%{http_code}" $API_ENDPOINT)
  
  if [ $response -ne 200 ]; then
    log "API is down (status code: $response). Restarting..."
    pm2 restart atlantic-api
    log "API restarted"
  else
    log "API is running properly"
  fi
}

# Check if frontend is accessible
check_frontend() {
  response=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)
  
  if [ $response -ne 200 ]; then
    log "Frontend is not accessible (status code: $response). Check Nginx."
    systemctl status nginx >> $LOG_FILE
  else
    log "Frontend is accessible"
  fi
}

# Main execution
log "Starting health check..."
check_api
check_frontend
log "Health check completed"
```

Make it executable:

```bash
chmod +x /var/www/atlanticenterprise/scripts/monitor.sh
```

## 3. Environment Variable Setup

The application has been updated to use environment variables for all API endpoints, keys, and configuration settings. This makes deployment across different environments much easier.

### Creating the Backend .env File

Create a file at `/var/www/atlanticenterprise/api/.env`:

```bash
nano /var/www/atlanticenterprise/api/.env
```

Add the following content, updating values as needed:

```
# Application Environment
NODE_ENV=production

# Server Configuration
PORT=3005
FRONTEND_URL=https://atlanticenterprise.in

# Supabase Configuration
SUPABASE_URL=https://cblvrevilzovvcwpjzee.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_rg235BX8eobmVD
RAZORPAY_KEY_SECRET=ymVrxQJNwAFG7p8ubXeGN0Fy

# CORS Settings
CORS_ALLOWED_ORIGINS=https://atlanticenterprise.in,https://www.atlanticenterprise.in
```

### Creating the Frontend Environment Settings

For the frontend, environment variables are compiled into the build. For production, these are already set during the build process. If you need to update them after deployment, you can create a file at `/var/www/atlanticenterprise/frontend/env-config.js`:

```bash
nano /var/www/atlanticenterprise/frontend/env-config.js
```

Add the following content:

```javascript
window.ENV = {
  VITE_API_URL: 'https://api.atlanticenterprise.in',
  VITE_RAZORPAY_KEY_ID: 'rzp_test_rg235BX8eobmVD'
}
```

Then update your Nginx configuration to include this file before loading the application:

```nginx
location = /env-config.js {
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

### Environment Variables in PM2

To ensure environment variables are available to the API when using PM2, use the following command to start or restart the application:

```bash
cd /var/www/atlanticenterprise/api
pm2 start api-server.js --name "atlantic-api" --env-from-file .env
```

Or update an existing process:

```bash
pm2 restart atlantic-api --update-env
```

## 4. Configure Nginx

### Create Configuration for Frontend

```bash
sudo nano /etc/nginx/sites-available/atlanticenterprise.in
```

Add the following content:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name atlanticenterprise.in www.atlanticenterprise.in;
    
    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name atlanticenterprise.in www.atlanticenterprise.in;
    
    # SSL Configuration (will be added by Certbot)
    
    root /var/www/atlanticenterprise/frontend;
    index index.html;
    
    # Environment config (allow dynamic runtime configuration)
    location = /env-config.js {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
    
    # Handle Static Files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
        try_files $uri =404;
    }
    
    # Handle frontend routing (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Create Configuration for API

```bash
sudo nano /etc/nginx/sites-available/api.atlanticenterprise.in
```

Add the following content:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.atlanticenterprise.in;
    
    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.atlanticenterprise.in;
    
    # SSL Configuration (will be added by Certbot)
    
    # Log files
    access_log /var/www/atlanticenterprise/logs/api_access.log;
    error_log /var/www/atlanticenterprise/logs/api_error.log;
    
    # Proxy to Node.js API
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Enable Configurations and Test Nginx

```bash
sudo ln -s /etc/nginx/sites-available/atlanticenterprise.in /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.atlanticenterprise.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. Set Up SSL with Let's Encrypt

```bash
sudo certbot --nginx -d atlanticenterprise.in -d www.atlanticenterprise.in
sudo certbot --nginx -d api.atlanticenterprise.in
```

## 6. Deploy the Application

### Prepare Frontend Files Locally

1. Make sure your frontend configuration has the correct API URL in `src/config.js`
2. Build the frontend:
   ```bash
   npm run build
   ```

3. Create a zip of the build files (excluding the server directory):
   ```bash
   cd dist
   zip -r ../frontend.zip . -x "server/*"
   ```

### Prepare Backend Files Locally

1. Create a zip of the server directory:
   ```bash
   cd dist
   zip -r ../backend.zip server/
   ```

### Upload Files to VPS

Using SCP:

```bash
scp frontend.zip user@your-vps-ip:/tmp/
scp backend.zip user@your-vps-ip:/tmp/
```

### Extract and Deploy Files on VPS

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Extract frontend files
cd /tmp
unzip -q frontend.zip -d /var/www/atlanticenterprise/frontend/

# Extract and setup backend files
mkdir -p /tmp/backend
unzip -q backend.zip -d /tmp/backend/
cp -R /tmp/backend/server/* /var/www/atlanticenterprise/api/
cd /var/www/atlanticenterprise/api/
npm install --production
```

### Set Up Database Functions

```bash
cd /var/www/atlanticenterprise/api
node execute_sql_functions.js
```

### Configure PM2 to Run the API

```bash
cd /var/www/atlanticenterprise/api
pm2 start api-server.js --name "atlantic-api" --env-from-file .env
pm2 save
pm2 startup
```

### Set Up Cron Job for Monitoring

```bash
crontab -e
```

Add the following line:

```
*/5 * * * * /var/www/atlanticenterprise/scripts/monitor.sh
```

## 7. DNS Configuration

Log in to your domain registrar (Hostinger) and add the following DNS records:

1. A record for `atlanticenterprise.in` pointing to your VPS IP
2. A record for `www.atlanticenterprise.in` pointing to your VPS IP
3. A record for `api.atlanticenterprise.in` pointing to your VPS IP

## 8. Testing Your Deployment

### Test Frontend

Open a web browser and navigate to:
```
https://atlanticenterprise.in
```

### Test API

Test API health endpoint:
```
https://api.atlanticenterprise.in/api/health
```

## 9. Setting Up Automatic Backups

Create a backup script at `/var/www/atlanticenterprise/scripts/backup.sh`:

```bash
#!/bin/bash

# Variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/atlanticenterprise/$TIMESTAMP"
SOURCE_DIR="/var/www/atlanticenterprise"
LOG_FILE="/var/www/atlanticenterprise/logs/backup.log"

# Create backup directory
mkdir -p $BACKUP_DIR

# Log function
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Backup frontend
log "Starting frontend backup..."
tar -czf $BACKUP_DIR/frontend.tar.gz -C $SOURCE_DIR frontend
log "Frontend backup completed"

# Backup backend
log "Starting backend backup..."
tar -czf $BACKUP_DIR/api.tar.gz -C $SOURCE_DIR api
log "Backend backup completed"

# Backup logs (excluding current backup log)
log "Starting logs backup..."
find $SOURCE_DIR/logs -type f -not -name "backup.log" -exec tar -rf $BACKUP_DIR/logs.tar {} \;
gzip $BACKUP_DIR/logs.tar
log "Logs backup completed"

# Clean old backups (keep last 7 days)
find /var/backups/atlanticenterprise -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
log "Cleaned old backups"

# Report backup size
BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
log "Backup completed. Size: $BACKUP_SIZE"
```

Make it executable and add to crontab:

```bash
chmod +x /var/www/atlanticenterprise/scripts/backup.sh
sudo mkdir -p /var/backups/atlanticenterprise
sudo crontab -e
```

Add this line to run backups daily at 2 AM:

```
0 2 * * * /var/www/atlanticenterprise/scripts/backup.sh
```

## 10. Maintenance Tasks

### Updating the Application

1. Build new versions locally
2. Create zip files as described in section 6
3. Upload zip files to VPS
4. Run the deploy script:
   ```bash
   /var/www/atlanticenterprise/scripts/deploy.sh both
   ```

### Updating Environment Variables

1. Edit the .env file:
   ```bash
   nano /var/www/atlanticenterprise/api/.env
   ```

2. Restart the API to apply changes:
   ```bash
   pm2 restart atlantic-api --update-env
   ```

### Checking Logs

```bash
# Frontend access logs
sudo tail -f /var/www/atlanticenterprise/logs/frontend_access.log

# Frontend error logs
sudo tail -f /var/www/atlanticenterprise/logs/frontend_error.log

# API logs
sudo tail -f /var/www/atlanticenterprise/logs/api_access.log
sudo tail -f /var/www/atlanticenterprise/logs/api_error.log

# PM2 logs
pm2 logs atlantic-api
```

### Monitoring Status

```bash
# Check Nginx status
sudo systemctl status nginx

# Check PM2 status
pm2 status

# Check disk space
df -h

# Check memory usage
free -m
```

## 11. Troubleshooting

### If Frontend Shows 404 Errors

Check Nginx configuration:
```bash
sudo nginx -t
```

### If API Is Not Accessible

1. Check if the API process is running:
   ```bash
   pm2 status
   ```

2. Restart API if needed:
   ```bash
   pm2 restart atlantic-api
   ```

3. Check API logs:
   ```bash
   pm2 logs atlantic-api
   ```

4. Verify environment variables:
   ```bash
   cd /var/www/atlanticenterprise/api
   pm2 env atlantic-api
   ```

### If SSL Certificates Expire

Renew certificates:
```bash
sudo certbot renew
```

## 12. Security Recommendations

1. **Keep Software Updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Set Up Fail2ban** to protect against brute force attacks:
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

3. **Regular Security Audits**:
   ```bash
   sudo apt install lynis
   sudo lynis audit system
   ```

## 13. Performance Optimization

1. **Enable Gzip Compression** in Nginx:
   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```

   Add or uncomment in the `http` section:
   ```
   gzip on;
   gzip_disable "msie6";
   gzip_vary on;
   gzip_proxied any;
   gzip_comp_level 6;
   gzip_buffers 16 8k;
   gzip_http_version 1.1;
   gzip_min_length 256;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype image/svg+xml image/x-icon;
   ```

2. **Set Up Browser Caching** (already included in the Nginx configuration above)

3. **Monitor and Optimize Node.js** with PM2:
   ```bash
   pm2 install pm2-server-monit
   ```

## Conclusion

You have now successfully set up a production-ready environment for Atlantic Enterprise on Hostinger VPS using Nginx. The deployment includes proper organization of files, automated scripts for deployment and monitoring, SSL encryption, and performance optimizations.

For any issues or questions, refer to the troubleshooting section above or contact support. 