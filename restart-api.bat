@echo off
echo Stopping any existing API server...
npx kill-port 3002

echo Starting API server...
node api-server.js

echo API server running at http://localhost:3002
echo Test page: http://localhost:3002/test 