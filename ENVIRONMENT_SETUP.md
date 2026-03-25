# Environment Setup Guide

This guide explains how to configure the KaziLink project with environment variables for SMS notifications and other settings.

## Backend Setup

### 1. Create `.env` file in `backend/` directory

```bash
cd backend
cp .env.example .env
```

### 2. Configure the `.env` file

The `.env` file contains all sensitive configuration. Edit it to add your credentials:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# SMS Provider - Choose one: mock, afrikas_talking, or twilio
SMS_PROVIDER=mock

# If using Africa's Talking
AFRIKAS_TALKING_API_KEY=your_api_key_here
AFRIKAS_TALKING_USERNAME=your_username_here

# If using Twilio
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

### 3. Install Optional SMS Provider Packages

Depending on which SMS provider you choose, install the appropriate package:

**Africa's Talking:**
```bash
pip install africastalking
```

**Twilio:**
```bash
pip install twilio
```

### 4. Verify Configuration

Test that Django loads the settings correctly:

```bash
python manage.py check
```

## Frontend Setup

### 1. Create `.env` file in `frontend/` directory

```bash
cd frontend
cp .env.example .env
```

### 2. Configure the `.env` file

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000

# Application
VITE_APP_NAME=KaziLink
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_SMS_NOTIFICATIONS=true
```

## SMS Provider Setup Details

### Mock Provider (Default)

No additional setup required. Perfect for development and testing.

```env
SMS_PROVIDER=mock
```

### Africa's Talking

1. Sign up at [Africa's Talking](https://africastalking.com/)
2. Get your API key and username from the dashboard
3. Add to `.env`:
   ```env
   SMS_PROVIDER=afrikas_talking
   AFRIKAS_TALKING_API_KEY=your_api_key_here
   AFRIKAS_TALKING_USERNAME=your_username_here
   ```
4. Install package: `pip install africastalking`

### Twilio

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID, Auth Token, and Phone Number from the dashboard
3. Add to `.env`:
   ```env
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
   ```
4. Install package: `pip install twilio`

## Environment Variables Reference

### Backend (.env)

| Variable | Type | Description |
|----------|------|-------------|
| DEBUG | Boolean | Enable Django debug mode |
| SECRET_KEY | String | Django secret key (change in production!) |
| ALLOWED_HOSTS | CSV | Comma-separated list of allowed hosts |
| SMS_PROVIDER | String | SMS provider: `mock`, `afrikas_talking`, or `twilio` |
| AFRIKAS_TALKING_API_KEY | String | Africa's Talking API key |
| AFRIKAS_TALKING_USERNAME | String | Africa's Talking username |
| TWILIO_ACCOUNT_SID | String | Twilio Account SID |
| TWILIO_AUTH_TOKEN | String | Twilio Auth Token |
| TWILIO_PHONE_NUMBER | String | Twilio phone number (e.g., +1234567890) |

### Frontend (.env)

| Variable | Type | Description |
|----------|------|-------------|
| VITE_API_BASE_URL | String | Backend API base URL |
| VITE_API_TIMEOUT | Number | API request timeout in ms |
| VITE_APP_NAME | String | Application name |
| VITE_APP_VERSION | String | Application version |
| VITE_ENABLE_SMS_NOTIFICATIONS | Boolean | Enable SMS notifications feature |
| VITE_ENABLE_ANALYTICS | Boolean | Enable analytics tracking |

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` files to version control
- The `.gitignore` file is configured to ignore `.env` files automatically
- Keep API keys and credentials secure
- Use strong, unique SECRET_KEY values in production
- Rotate credentials regularly

## Testing the Setup

### Test Django Configuration
```bash
cd backend
python manage.py check
```

### Test SMS Integration
```bash
cd backend
python manage.py shell
>>> from users.sms import safe_send_sms
>>> result = safe_send_sms("+254712345678", "Test message")
>>> print(result)  # Should print True (with mock) or actual result
```

### Run Development Server
```bash
cd backend
python manage.py runserver 8000
```

In another terminal:
```bash
cd frontend
npm run dev
```

## Troubleshooting

### SMS Provider Not Working
1. Verify `SMS_PROVIDER` is set correctly in `.env`
2. Check that API credentials are correct
3. Ensure the provider package is installed: `pip list | grep -E 'africastalking|twilio'`
4. Check Django logs for detailed error messages

### Import Errors
If you see import errors for SMS packages:
```bash
# Check if package is installed
pip list

# Install if missing
pip install africastalking  # or twilio
```

### Environment Variables Not Loading
```bash
# Verify python-dotenv is installed
pip list | grep python-dotenv

# If not installed
pip install python-dotenv
```

## Further Reading

- [Django Documentation](https://docs.djangoproject.com/)
- [Africa's Talking Python SDK](https://africastalking.github.io/python/)
- [Twilio Python SDK](https://www.twilio.com/docs/python/install)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
