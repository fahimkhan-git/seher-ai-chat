#!/bin/bash

# Simple script to push to GitHub
# Run this: ./push.sh

cd "/Volumes/homesfy workspace/chat-boat 2"

echo "Pushing to GitHub..."
echo "Repository: https://github.com/fahimkhan-git/seher-ai-chat"
echo ""

# Try with token in URL (replace with your token)
# git remote set-url origin https://YOUR_TOKEN@github.com/fahimkhan-git/seher-ai-chat.git
git remote set-url origin https://fahimkhan-git@github.com/fahimkhan-git/seher-ai-chat.git

git push -u origin main

# Reset remote
git remote set-url origin https://fahimkhan-git@github.com/fahimkhan-git/seher-ai-chat.git

echo ""
echo "Done!"

