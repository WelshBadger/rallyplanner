#!/bin/bash
echo "🧪 RALLY PLANNER COMPREHENSIVE TEST"
echo "==================================="

# Test 1: Build Process
echo "✅ 1. Testing build process..."
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Build: SUCCESS"
else
  echo "❌ Build: FAILED"
  exit 1
fi

# Test 2: Function Deployment
echo "✅ 2. Testing function deployment..."
netlify functions:list | grep analyze-document
if [ $? -eq 0 ]; then
  echo "✅ Function: DEPLOYED"
else
  echo "❌ Function: NOT DEPLOYED"
fi

# Test 3: Environment Variables
echo "✅ 3. Testing environment variables..."
netlify env:list | grep OPENAI_API_KEY
if [ $? -eq 0 ]; then
  echo "✅ Environment: CONFIGURED"
else
  echo "❌ Environment: MISSING VARIABLES"
fi

# Test 4: Site Accessibility
echo "✅ 4. Testing site accessibility..."
SITE_URL=$(netlify status --json | jq -r '.site.url')
curl -s -o /dev/null -w "%{http_code}" $SITE_URL
if [ $? -eq 0 ]; then
  echo "✅ Site: ACCESSIBLE at $SITE_URL"
else
  echo "❌ Site: NOT ACCESSIBLE"
fi

# Test 5: Function Endpoint
echo "✅ 5. Testing function endpoint..."
curl -s -X POST "$SITE_URL/.netlify/functions/analyze-document" \
  -H "Content-Type: application/json" \
  -d '{"documentText":"Test rally document"}' | jq '.source'

echo "🏁 Rally Planner Test Complete!"
