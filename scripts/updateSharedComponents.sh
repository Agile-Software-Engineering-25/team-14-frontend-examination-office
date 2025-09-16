#!/usr/bin/env bash

# Allow specifying a branch as argument
BRANCH=${1:-main}

echo "Updating shared components to branch: $BRANCH"

# Navigate to shared-components submodule
cd shared-components

# Check for uncommitted changes and handle them
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  Found uncommitted changes in shared-components"
    echo "🧹 Stashing local changes..."
    git stash push -m "Auto-stash before branch switch $(date)"
fi

# Check if we're already on the desired branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Currently on branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "🔄 Switching to branch: $BRANCH"
    
    # Fetch all remote branches
    git fetch origin
    
    # Check if branch exists locally
    if git show-ref --verify --quiet refs/heads/$BRANCH; then
        echo "✅ Local branch exists, checking out..."
        git checkout $BRANCH
    else
        echo "🌱 Creating local branch from remote..."
        git checkout -b $BRANCH origin/$BRANCH
    fi
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to switch to branch $BRANCH"
        
        # Try to recover stashed changes if they exist
        if git stash list | grep -q "Auto-stash before branch switch"; then
            echo "🔄 Restoring stashed changes..."
            git stash pop
        fi
        exit 1
    fi
else
    echo "✅ Already on correct branch"
fi

# Pull latest changes from remote
echo "🔄 Pulling latest changes from origin/$BRANCH..."
git pull origin $BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Successfully pulled latest changes"
else
    echo "❌ Failed to pull changes"
    exit 1
fi

# Show current commit info
CURRENT_COMMIT=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
echo "📦 Now on commit: $CURRENT_COMMIT"
echo "💬 Latest commit: $COMMIT_MESSAGE"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build
echo "🔨 Building shared components..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Go back to parent directory
cd ..

echo ""
echo "🎉 Shared components updated successfully!"
echo "📋 Summary:"
echo "   Branch: $BRANCH"
echo "   Commit: $CURRENT_COMMIT"
echo ""
echo "📝 To commit this submodule update:"
echo "   git add shared-components"
echo "   git commit -m 'chore: update shared-components to $BRANCH ($CURRENT_COMMIT)'"
