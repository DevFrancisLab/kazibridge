# SMS Integration Architecture

## Overview

The KaziLink platform now has a complete SMS notification system with support for multiple SMS providers. The system is configured via environment variables and implements crash-proof error handling.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Events                        │
│  (Job Creation, Bid Creation, Bid Acceptance, etc.)         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              safe_send_sms() - Safe Wrapper                 │
│         (Catches exceptions, never crashes app)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│             send_sms() - Core SMS Function                  │
│              (Routes to correct provider)                   │
└─────────┬─────────────────┬─────────────────┬───────────────┘
          │                 │                 │
    ┌─────▼─────┐     ┌─────▼─────┐     ┌────▼──────┐
    │   Mock     │     │ Africa's   │     │  Twilio   │
    │   SMS      │     │  Talking   │     │   SMS     │
    │ (Dev/Test) │     │  (Prod)    │     │  (Prod)   │
    └────────────┘     └────────────┘     └───────────┘
          │                 │                 │
          └─────────────────┴─────────────────┘
                     │
                     ▼
            ┌────────────────────┐
            │   Django Logging   │
            │  (Console Output)  │
            └────────────────────┘
```

## Configuration Flow

```
1. .env file loaded
   ↓
2. python-dotenv reads .env
   ↓
3. Django settings.py uses os.getenv()
   ↓
4. SMS module gets config from settings
   ↓
5. safe_send_sms() wrapper ensures reliability
   ↓
6. send_sms() routes to correct provider
   ↓
7. Provider-specific function sends SMS
   ↓
8. Result logged to console and Django logs
```

## File Structure

```
kazibridge/
├── .env                          # Backend environment (secrets)
├── .env.example                  # Backend template
├── .gitignore                    # Prevents .env from git
├── SMS_QUICKSTART.md            # Quick reference
├── ENVIRONMENT_SETUP.md         # Detailed guide
│
├── backend/
│   ├── .env                     # Environment variables ← YOU EDIT THIS
│   ├── .env.example             # Template for .env
│   ├── requirements.txt         # Python dependencies
│   ├── manage.py
│   ├── config/
│   │   └── settings.py          # Updated to load .env
│   └── users/
│       ├── sms.py              # Updated with provider routing
│       ├── views.py            # Uses safe_send_sms()
│       └── models.py           # User model with phone_number
│
└── frontend/
    ├── .env                     # Environment variables
    └── .env.example             # Template
```

## SMS Provider Integration Points

### 1. Mock SMS (Development)
- **Status**: Always available
- **Setup**: No additional setup required
- **Use Case**: Development, testing, CI/CD
- **Output**: Logs to console with 📱 emoji

### 2. Africa's Talking
- **Status**: Production-ready
- **Setup**: 
  - Sign up at https://africastalking.com/
  - Get API key and username
  - Add to `.env`
  - Install: `pip install africastalking`
- **Use Case**: Production in East Africa
- **Output**: Logs API response with SID

### 3. Twilio
- **Status**: Production-ready
- **Setup**:
  - Sign up at https://www.twilio.com/
  - Get Account SID, Auth Token, Phone Number
  - Add to `.env`
  - Install: `pip install twilio`
- **Use Case**: Production worldwide
- **Output**: Logs SMS status

## API Flow Example: Job Creation

```python
# 1. Client creates a job
POST /api/jobs/
{
    "title": "Web Development",
    "description": "Build a website",
    "budget": 50000
}
    ↓
# 2. JobListCreateView.perform_create() called
    ↓
# 3. Calls send_job_notification_to_freelancers(job)
    ↓
# 4. For each relevant freelancer:
#    - Builds message
#    - Calls safe_send_sms(phone, message)
    ↓
# 5. safe_send_sms() calls send_sms()
    ↓
# 6. send_sms() checks SMS_PROVIDER setting:
#    - If "mock": calls _send_sms_mock()
#    - If "afrikas_talking": calls _send_sms_afrikas_talking()
#    - If "twilio": calls _send_sms_twilio()
    ↓
# 7. Provider function sends SMS or logs error
    ↓
# 8. Result returned to safe_send_sms()
    ↓
# 9. safe_send_sms() returns boolean
#    (never raises exception)
    ↓
# 10. Job creation completes successfully
#     (even if SMS failed)
    ↓
# 11. Result logged with full context
```

## Error Handling Strategy

```
SMS Operation
    │
    └─► Exception Caught
        │
        ├─► Log full context
        │   - Phone number
        │   - Message
        │   - Exception details
        │   - Exception type
        │
        ├─► Print to console
        │   (for immediate debugging)
        │
        └─► Return False
            (never raise exception)
                │
                └─► Business logic continues
                    (Job is created, bid is accepted, etc.)
```

## Example Usage

### Test in Django Shell

```bash
python manage.py shell
```

```python
# Test with mock SMS
from django.conf import settings
from users.sms import safe_send_sms

# Check current provider
print(f"Current provider: {settings.SMS_PROVIDER}")

# Send test SMS
result = safe_send_sms("+254712345678", "Hello from KaziLink")
print(f"SMS sent: {result}")
```

### Check SMS Logs

```bash
# Real-time logs
tail -f /path/to/django.log | grep SMS

# Or in Django console
python manage.py shell
>>> from django.core.management import call_command
>>> call_command('shell')
```

## Environment Variables Reference

### Backend (.env)

```env
# SMS Provider (required)
# Options: mock, afrikas_talking, twilio
SMS_PROVIDER=mock

# Africa's Talking (if SMS_PROVIDER=afrikas_talking)
AFRIKAS_TALKING_API_KEY=your_api_key
AFRIKAS_TALKING_USERNAME=your_username

# Twilio (if SMS_PROVIDER=twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENABLE_SMS_NOTIFICATIONS=true
```

## Monitoring and Debugging

### Console Output
```
📱 SMS SENT: +254712345678 -> 'New job posted...' (Mock)
🚨 SAFE_SMS_WRAPPER: SMS FAILED - +254712345678 -> Connection timeout
```

### Django Logs
```
INFO SMS ATTEMPT - Phone: +254712345678, Message: 'New job posted...'
INFO SMS SUCCESS - Phone: +254712345678, Response: {'status': 'Success', ...}
ERROR SMS FAILED - Phone: +254712345678, Error: Connection timeout
```

## Security Considerations

1. **Credentials Storage**
   - Keep API keys in `.env` file
   - Never commit `.env` to version control
   - Use `.env.example` as template

2. **Error Messages**
   - SMS errors logged but not exposed to client
   - Prevents information leakage
   - Client only sees business logic result

3. **Rate Limiting**
   - Not implemented yet
   - Consider adding for production
   - Prevents SMS API abuse

4. **SMS Content**
   - Keep messages concise
   - Don't include sensitive data in SMS
   - Consider GDPR/privacy regulations

## Production Deployment

### For Africa's Talking:

1. Get production API credentials from Africa's Talking
2. Set in production `.env`:
   ```env
   SMS_PROVIDER=afrikas_talking
   AFRIKAS_TALKING_API_KEY=prod_key_here
   AFRIKAS_TALKING_USERNAME=prod_username_here
   ```
3. Ensure `DEBUG=False` in production
4. Monitor SMS logs for errors

### For Twilio:

1. Get production Account SID and Auth Token
2. Set in production `.env`:
   ```env
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=prod_sid_here
   TWILIO_AUTH_TOKEN=prod_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```
3. Ensure `DEBUG=False` in production
4. Monitor SMS logs for errors

## Future Enhancements

1. **SMS Templates**
   - Pre-defined message templates for different events
   - Support for variable substitution

2. **SMS Delivery Status**
   - Track SMS delivery status
   - Handle bounces and errors

3. **SMS Retry Logic**
   - Automatic retry with exponential backoff
   - Maximum retry attempts

4. **SMS Analytics**
   - Track SMS sending metrics
   - Cost tracking
   - Delivery rate analysis

5. **User Preferences**
   - SMS opt-in/opt-out
   - Notification frequency control
   - Preferred time for notifications

6. **SMS History**
   - Store SMS sending history
   - User-facing SMS logs
   - Compliance reporting

## Support

For detailed setup instructions, see:
- `ENVIRONMENT_SETUP.md` - Complete setup guide
- `SMS_QUICKSTART.md` - Quick reference

For code examples, see:
- `backend/users/sms.py` - SMS implementation
- `backend/users/views.py` - Usage examples
