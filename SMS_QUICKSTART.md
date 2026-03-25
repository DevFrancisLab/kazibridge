# SMS Configuration Quick Start

## TL;DR

### For Development (Mock SMS)
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env and set: SMS_PROVIDER=mock

# Frontend  
cd frontend
cp .env.example .env

# Run
python manage.py runserver 8000
npm run dev
```

### For Africa's Talking
```bash
# 1. Get credentials from https://africastalking.com/
# 2. Edit backend/.env:
SMS_PROVIDER=afrikas_talking
AFRIKAS_TALKING_API_KEY=your_api_key
AFRIKAS_TALKING_USERNAME=your_username

# 3. Install package
pip install africastalking

# 4. Test
python manage.py shell
>>> from users.sms import safe_send_sms
>>> safe_send_sms("+254712345678", "Hello")
```

### For Twilio
```bash
# 1. Get credentials from https://www.twilio.com/
# 2. Edit backend/.env:
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# 3. Install package
pip install twilio

# 4. Test
python manage.py shell
>>> from users.sms import safe_send_sms
>>> safe_send_sms("+254712345678", "Hello")
```

## Files Created

- `backend/.env` - Backend configuration (you created this, add your credentials)
- `backend/.env.example` - Template for backend configuration
- `frontend/.env` - Frontend configuration
- `frontend/.env.example` - Template for frontend configuration
- `backend/config/settings.py` - Updated to load from .env
- `backend/users/sms.py` - Updated to support multiple SMS providers
- `.gitignore` - Configured to ignore .env files
- `ENVIRONMENT_SETUP.md` - Detailed setup guide

## Next Steps

1. **Choose your SMS provider:**
   - `mock` (default, no setup)
   - `afrikas_talking` (Africa's Talking)
   - `twilio` (Twilio)

2. **Update `.env` with your choice**

3. **Install optional packages if needed:**
   ```bash
   pip install africastalking  # For Africa's Talking
   pip install twilio          # For Twilio
   ```

4. **Test the setup:**
   ```bash
   python manage.py check
   python manage.py shell
   ```

## Environment Variables Loaded Successfully ✅

Your `.env` file is being loaded automatically. Django settings now include:
- `SMS_PROVIDER` - Which SMS service to use
- `AFRIKAS_TALKING_API_KEY` - Africa's Talking credentials
- `AFRIKAS_TALKING_USERNAME` - Africa's Talking credentials
- `TWILIO_ACCOUNT_SID` - Twilio credentials
- `TWILIO_AUTH_TOKEN` - Twilio credentials
- `TWILIO_PHONE_NUMBER` - Twilio phone number

## Current Status

✅ Environment variables configured
✅ SMS module updated with provider support
✅ Multiple SMS providers ready:
  - Mock (development)
  - Africa's Talking (production)
  - Twilio (production)
✅ Safe error handling ensures SMS failures don't break business logic
✅ Comprehensive logging for debugging

## Support

See `ENVIRONMENT_SETUP.md` for detailed documentation.
