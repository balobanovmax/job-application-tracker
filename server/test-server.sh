#!/bin/bash

# Test Express Server Setup
echo "🧪 Testing Express Server..."
echo ""

# Test 1: Health Check
echo "Test 1: Health Check Endpoint"
response=$(curl -s http://localhost:3001/health)
if [[ $response == *"ok"* ]]; then
  echo "✓ Health check passed"
else
  echo "✗ Health check failed"
  exit 1
fi
echo ""

# Test 2: 404 Handler
echo "Test 2: 404 Handler"
response=$(curl -s http://localhost:3001/nonexistent)
if [[ $response == *"Route not found"* ]]; then
  echo "✓ 404 handler working"
else
  echo "✗ 404 handler failed"
  exit 1
fi
echo ""

# Test 3: CORS Headers
echo "Test 3: CORS Headers"
cors=$(curl -s -I http://localhost:3001/health | grep -i "access-control-allow-origin")
if [[ $cors == *"Access-Control-Allow-Origin"* ]]; then
  echo "✓ CORS enabled"
else
  echo "✗ CORS not configured"
  exit 1
fi
echo ""

# Test 4: JSON Middleware
echo "Test 4: JSON Middleware (accepts JSON)"
response=$(curl -s -X GET http://localhost:3001/health \
  -H "Content-Type: application/json")
if [[ $response == *"ok"* ]]; then
  echo "✓ JSON middleware working"
else
  echo "✗ JSON middleware failed"
  exit 1
fi
echo ""

echo "🎉 All server tests passed!"

