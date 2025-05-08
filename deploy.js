import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files needed for backend deployment
const serverFiles = [
  'api-server.js',
  'package.json',
  'package-lock.json',
  'create_db_functions.sql',
  'create_rpc_functions.sql',
  'execute_sql_functions.js',
  'fix-storage.sql',
  'fix_applications_table.sql',
];

// Create server folder in dist
const distPath = path.join(__dirname, 'dist');
const serverPath = path.join(distPath, 'server');

if (!fs.existsSync(serverPath)) {
  fs.mkdirSync(serverPath, { recursive: true });
}

// Copy necessary files to the server folder
serverFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(serverPath, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to server folder`);
  } else {
    console.warn(`Warning: File ${file} not found`);
  }
});

// Create an optimized package.json for the server
const packageJson = require('./package.json');
const serverPackageJson = {
  name: packageJson.name + '-server',
  version: packageJson.version,
  description: packageJson.description + ' (Server)',
  main: 'api-server.js',
  type: 'module',
  scripts: {
    start: 'node api-server.js',
    setup: 'node execute_sql_functions.js'
  },
  dependencies: {
    cors: packageJson.dependencies.cors,
    express: packageJson.dependencies.express,
    razorpay: packageJson.dependencies.razorpay,
    '@supabase/supabase-js': packageJson.dependencies['@supabase/supabase-js'],
    crypto: '*'
  },
  engines: {
    node: '>=14.0.0'
  }
};

fs.writeFileSync(
  path.join(serverPath, 'package.json'),
  JSON.stringify(serverPackageJson, null, 2)
);
console.log('Created optimized package.json for server');

// Create Vercel configuration file for the frontend
const vercelConfig = {
  version: 2,
  routes: [
    { handle: 'filesystem' },
    { src: '/(.*)', dest: '/index.html' }
  ]
};

fs.writeFileSync(
  path.join(distPath, 'vercel.json'),
  JSON.stringify(vercelConfig, null, 2)
);
console.log('Created vercel.json for frontend deployment');

// Create .env.example file for the server
const envExample = `
# Server Configuration
PORT=3005

# Razorpay API Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
`;

fs.writeFileSync(
  path.join(serverPath, '.env.example'),
  envExample.trim()
);
console.log('Created .env.example file for server configuration');

// Create a README for deployment instructions
const readmeContent = `
# Atlantic Enterprise Deployment

This folder contains the production build for Atlantic Enterprise application.

## Structure
- Frontend files are in the root of the dist directory
- Backend files are in the 'server' subdirectory

## Frontend Deployment (Vercel, Netlify, or any static hosting)
Just deploy the contents of the 'dist' directory (excluding the 'server' folder)

## Backend Deployment (Any Node.js hosting like Heroku, DigitalOcean, etc.)
1. Deploy the contents of the 'server' directory
2. Create a .env file based on .env.example
3. Run 'npm install' to install dependencies
4. Run 'npm run setup' to set up the database functions
5. Run 'npm start' to start the server

## Database Setup
The application requires a Supabase database with the following:
1. Tables: applications, internships, users
2. Storage bucket: resumes
3. RPC functions for bypassing RLS policies

Run 'npm run setup' after deployment to create necessary database functions.
`;

fs.writeFileSync(
  path.join(distPath, 'README.md'),
  readmeContent.trim()
);
console.log('Created README.md with deployment instructions');

console.log('\nDeployment preparation complete! The dist folder now contains:');
console.log('1. Frontend build files (for static hosting)');
console.log('2. Server files in the server/ subdirectory (for backend hosting)');
console.log('\nFollow the instructions in dist/README.md to deploy your application.'); 