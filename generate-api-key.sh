#!/bin/bash

# 🔑 Generate Secure API Key for Widget Configuration

echo "🔑 Generating Secure API Key..."
echo ""

# Try different methods to generate a secure key
if command -v openssl &> /dev/null; then
    KEY=$(openssl rand -hex 32)
    echo "✅ Generated using OpenSSL:"
elif command -v node &> /dev/null; then
    KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo "✅ Generated using Node.js:"
else
    # Fallback: use /dev/urandom
    KEY=$(head -c 32 /dev/urandom | xxd -p -c 32 | head -c 64)
    echo "✅ Generated using /dev/urandom:"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Add this to your .env file:"
echo "   WIDGET_CONFIG_API_KEY=$KEY"
echo ""
echo "📝 Or set as environment variable:"
echo "   export WIDGET_CONFIG_API_KEY=\"$KEY\""
echo ""
echo "🔒 Keep this key secret and never commit it to git!"

