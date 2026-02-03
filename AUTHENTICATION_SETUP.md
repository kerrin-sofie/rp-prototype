# GitHub Authentication Setup

GitHub requires a **Personal Access Token (PAT)** for HTTPS authentication. Here's how to set it up:

## Option 1: Create a Personal Access Token (Recommended)

### Step 1: Create a Token
1. Go to: https://github.com/settings/tokens/new
2. Give it a name: `rp-prototype-deploy`
3. Set expiration (or "No expiration" for convenience)
4. Select scopes: Check **`repo`** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Use the Token
When git asks for your password, use the **token** instead of your GitHub password.

Or set it up permanently:

```bash
# Store the token in macOS Keychain
git credential-osxkeychain erase
host=github.com
protocol=https
[Press Enter twice]

# Then when you push, use your username and paste the token as password
```

## Option 2: Use SSH Authentication (Alternative)

### Step 1: Check for existing SSH key
```bash
ls -al ~/.ssh
```

### Step 2: Generate SSH key (if you don't have one)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Optionally set a passphrase
```

### Step 3: Add SSH key to GitHub
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
# Or if you have id_rsa.pub:
# cat ~/.ssh/id_rsa.pub
```

Then:
1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Paste your public key
4. Click **"Add SSH key"**

### Step 4: Change remote to SSH
```bash
cd /Users/kerrinspintig/Desktop/Arbio-cursor/rp-new
git remote set-url origin git@github.com:kerrin-sofie/rp-prototype.git
```

## Option 3: Use GitHub CLI (Easiest)

Install GitHub CLI:
```bash
brew install gh
```

Authenticate:
```bash
gh auth login
# Follow the prompts - it will handle everything for you
```

Then you can use git normally and it will use your GitHub CLI credentials.
