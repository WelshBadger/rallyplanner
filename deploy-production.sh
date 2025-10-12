#!/bin/bash
echo "🏁 RALLY PLANNER PRODUCTION DEPLOYMENT"
echo "====================================="

# Pre-flight checks
echo "✅ Running pre-flight checks..."
./test-rally-planner.sh

# Clean build
echo "🧹 Cleaning previous builds..."
rm -rf .next out netlify/functions/node_modules

# Install dependencies
echo "📦 Installing dependencies..."
cd netlify/functions && npm install && cd ../..

# Build application
echo "🔨 Building application..."
npm run build

# Test build output
echo "🧪 Testing build output..."
ls -la out/

# Deploy to production
echo "🚀 Deploying to production..."
netlify deploy --prod --dir=out

# Post-deployment validation
echo "✅ Running post-deployment validation..."
sleep 10  # Wait for deployment to propagate

# Test live site
SITE_URL=$(netlify status --json | jq -r '.site.url')
echo "🌐 Testing live site: $SITE_URL"

curl -s -o /dev/null -w "%{http_code}" $SITE_URL
if [ $? -eq 0 ]; then
  echo "✅ Site is live and accessible!"
else
  echo "❌ Site accessibility test failed"
fi

echo "🏁 Rally Planner is LIVE and ready for rally teams!"
echo "📱 Mobile URL: $SITE_URL"
echo "📄 Test document upload functionality"
echo "👥 Test team management features"
echo "🚨 Test emergency contact access"

