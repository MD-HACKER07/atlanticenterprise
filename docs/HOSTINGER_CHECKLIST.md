# Atlantic Enterprise Deployment Checklist

Use this checklist alongside the detailed deployment guide to ensure all steps are completed.

## 1. Server Preparation

- [ ] Connect to VPS via SSH
- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Install dependencies: `sudo apt install -y curl wget git nginx certbot python3-certbot-nginx ufw`
- [ ] Configure firewall: 
  - [ ] `sudo ufw allow OpenSSH`
  - [ ] `sudo ufw allow 'Nginx Full'`
  - [ ] `sudo ufw enable`
- [ ] Install Node.js and npm
- [ ] Install PM2: `sudo npm install -g pm2`

## 2. Directory Setup

- [ ] Create directory structure:
  ```
  /var/www/atlanticenterprise/
  ├── frontend/
  ├── api/
  ├── logs/
  └── scripts/
  ```
- [ ] Set proper ownership: `sudo chown -R $USER:$USER /var/www/atlanticenterprise`
- [ ] Create deployment and monitoring scripts

## 3. Environment Variable Setup

- [ ] Create API server .env file:
  - [ ] Production environment setting
  - [ ] Port configuration
  - [ ] Supabase credentials
  - [ ] Razorpay keys
  - [ ] CORS settings
- [ ] Create runtime frontend env-config.js (optional)

## 4. Nginx Configuration

- [ ] Create frontend config: `/etc/nginx/sites-available/atlanticenterprise.in`
- [ ] Create API config: `/etc/nginx/sites-available/api.atlanticenterprise.in`
- [ ] Enable sites in Nginx
- [ ] Test configuration: `sudo nginx -t`
- [ ] Restart Nginx: `sudo systemctl restart nginx`

## 5. SSL Setup

- [ ] Generate certificates for frontend: `sudo certbot --nginx -d atlanticenterprise.in -d www.atlanticenterprise.in`
- [ ] Generate certificates for API: `sudo certbot --nginx -d api.atlanticenterprise.in`

## 6. Application Deployment

- [ ] Prepare frontend locally:
  - [ ] Update API URL in config
  - [ ] Build: `npm run build`
  - [ ] Create zip: `zip -r ../frontend.zip . -x "server/*"`
- [ ] Prepare backend locally: `zip -r ../backend.zip server/`
- [ ] Upload files to VPS
- [ ] Deploy frontend files
- [ ] Deploy backend files
- [ ] Install backend dependencies
- [ ] Run database setup script
- [ ] Configure PM2 with environment variables: `pm2 start api-server.js --name "atlantic-api" --env-from-file .env`
- [ ] Enable PM2 startup: `pm2 save && pm2 startup`

## 7. DNS Configuration

- [ ] Add A record for `atlanticenterprise.in`
- [ ] Add A record for `www.atlanticenterprise.in`
- [ ] Add A record for `api.atlanticenterprise.in`

## 8. Testing

- [ ] Test frontend: `https://atlanticenterprise.in`
- [ ] Test API: `https://api.atlanticenterprise.in/api/health`
- [ ] Test all main application features
- [ ] Verify environment variables are loaded: `pm2 env atlantic-api`

## 9. Maintenance Setup

- [ ] Configure automatic backups
- [ ] Set up monitoring cron job
- [ ] Enable log rotation
- [ ] Configure security settings
- [ ] Enable gzip compression in Nginx

## 10. Final Checks

- [ ] Verify Nginx is running: `sudo systemctl status nginx`
- [ ] Verify API is running: `pm2 status`
- [ ] Verify SSL certificates: `https://www.ssllabs.com/ssltest/`
- [ ] Verify firewall status: `sudo ufw status` 