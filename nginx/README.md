# Atlantic Enterprise Nginx Configuration

This directory contains optimized Nginx configuration files for hosting the Atlantic Enterprise application on a Hostinger VPS.

## Files Overview

- `nginx.conf` - Main Nginx configuration file with optimized server settings
- `frontend.atlanticenterprise.in.conf` - Nginx configuration for the React frontend
- `api.atlanticenterprise.in.conf` - Nginx configuration for the Node.js API server

## Installation Instructions

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Generate DH Parameters for SSL

This is used for enhanced security. It might take a few minutes to complete.

```bash
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

### 3. Copy Configuration Files

Copy the main Nginx configuration:

```bash
sudo cp nginx.conf /etc/nginx/nginx.conf
```

Copy the site-specific configurations:

```bash
sudo cp frontend.atlanticenterprise.in.conf /etc/nginx/sites-available/
sudo cp api.atlanticenterprise.in.conf /etc/nginx/sites-available/
```

Create symbolic links to enable the sites:

```bash
sudo ln -s /etc/nginx/sites-available/frontend.atlanticenterprise.in.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.atlanticenterprise.in.conf /etc/nginx/sites-enabled/
```

### 4. Create Required Directories

```bash
sudo mkdir -p /var/www/atlanticenterprise/{frontend,api,logs}
sudo chown -R $USER:$USER /var/www/atlanticenterprise
```

### 5. Set Up SSL Certificates with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d atlanticenterprise.in -d www.atlanticenterprise.in
sudo certbot --nginx -d api.atlanticenterprise.in
```

### 6. Test and Apply Configuration

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Configuration Details

### Frontend Configuration Highlights

- HTTPS redirection
- SSL optimization
- Static file caching
- Environment variables support
- Content Security Policy
- Advanced security headers
- Single Page Application (SPA) routing

### API Configuration Highlights

- HTTPS redirection
- SSL optimization
- CORS headers pre-configuration
- Proxy configuration for Node.js backend
- Rate limiting protection
- Buffer settings for optimal performance
- Special handling for the test endpoint
- Health check endpoint with caching

## Customization

### Adjusting Rate Limits

If you need to adjust rate limits, modify the following in `nginx.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

Change `10r/s` to your desired request rate per second.

### Updating CORS Settings

To add more allowed origins for CORS, modify the value in `api.atlanticenterprise.in.conf`:

```nginx
add_header 'Access-Control-Allow-Origin' 'https://atlanticenterprise.in' always;
```

For multiple origins, you'll need to use a variable:

```nginx
map $http_origin $cors_origin {
    default "";
    "https://atlanticenterprise.in" "$http_origin";
    "https://www.atlanticenterprise.in" "$http_origin";
    # Add more origins as needed
}

add_header 'Access-Control-Allow-Origin' $cors_origin always;
```

### Content Security Policy

The Content Security Policy (CSP) in `frontend.atlanticenterprise.in.conf` is configured for common use cases. Adjust it according to your specific needs:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.atlanticenterprise.in https://*.supabase.co; object-src 'none';" always;
```

## Troubleshooting

### Check Nginx Error Logs

```bash
sudo tail -f /var/log/nginx/error.log
```

### Check Site-Specific Logs

```bash
tail -f /var/www/atlanticenterprise/logs/frontend_error.log
tail -f /var/www/atlanticenterprise/logs/api_error.log
```

### Test Nginx Configuration

```bash
sudo nginx -t
```

### Restart Nginx

```bash
sudo systemctl restart nginx
```

### SSL Certificate Issues

Renew certificates:

```bash
sudo certbot renew
```

Check certificate status:

```bash
sudo certbot certificates
``` 