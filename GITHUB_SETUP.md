# GitHub Push Setup Guide

## Issue
Git is using wrong credentials (`khanfahim2025` instead of `fahimkhan-git`), causing 403 permission denied.

## Solution: Use Personal Access Token

### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. **Note**: `seher-ai-chat-deploy`
3. **Expiration**: Choose your preference (90 days recommended)
4. **Select scopes**: Check `repo` (all repository permissions)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Push to GitHub

```bash
cd "/Volumes/homesfy workspace/chat-boat 2"
git push -u origin main
```

When prompted:
- **Username**: `fahimkhan-git`
- **Password**: Paste your Personal Access Token (not your GitHub password)

### Alternative: Clear Cached Credentials

If you want to clear old credentials:

```bash
# Clear macOS keychain credentials
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https
EOF

# Then try pushing again
git push -u origin main
```

### Alternative: Use SSH (if you have SSH key set up)

```bash
# Change remote to SSH
git remote set-url origin git@github.com:fahimkhan-git/seher-ai-chat.git

# Push
git push -u origin main
```

## Current Remote Configuration

The remote is currently set to:
```
https://fahimkhan-git@github.com/fahimkhan-git/seher-ai-chat.git
```

This will prompt for credentials when pushing.

## Quick Command

```bash
git push -u origin main
# Username: fahimkhan-git
# Password: [Your Personal Access Token]
```

