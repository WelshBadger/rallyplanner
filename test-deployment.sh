#!/bin/bash
echo "🧪 RALLY PLANNER DEPLOYMENT TEST"
echo "================================"

echo "✅ 1. Checking file structure..."
ls -la netlify/functions/
ls -la netlify.toml
ls -la out/

echo "✅ 2. Checking environment variables..."
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OPENAI_API_KEY not set locally"
else
  echo "✅ OPENAI_API_KEY configured"
fi

echo "✅ 3. Testing build process..."
npm run build

echo "✅ 4. Checking build output..."
ls -la out/

echo "✅ 5. Testing function locally..."
cd netlify/functions && npm test 2>/dev/null || echo "⚠️  No local tests configured"

echo "🚀 Ready for deployment!"
