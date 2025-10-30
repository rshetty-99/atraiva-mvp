# Clerk Webhook Setup Guide

## Setting up Clerk Webhooks for Local Development

### 1. Install and Setup ngrok (for local development)

```bash
# Install ngrok globally
npm install -g ngrok

# Or download from https://ngrok.com/download
```

### 2. Expose Local Server

```bash
# Start your Next.js app (should be running on port 3008)
npm run dev

# In another terminal, expose the local server
ngrok http 3008
```

This will give you a public URL like: `https://abc123.ngrok-free.app`

### 3. Configure Clerk Webhook

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Webhooks** in the sidebar
4. Click **+ Add Endpoint**
5. Set the endpoint URL to: `https://your-ngrok-url.ngrok-free.app/api/webhooks/clerk`
6. Select the following events to subscribe to:
   - `user.created`
   - `user.updated` 
   - `user.deleted`
   - `session.created`
   - `session.ended`

### 4. Update Environment Variables

After creating the webhook endpoint:

1. Copy the **Webhook Secret** from the Clerk dashboard
2. Update your `.env.local` file:

```env
CLERK_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

### 5. Test the Webhook

1. Restart your Next.js development server
2. Create a new user account through your application
3. Check the server logs to see webhook events being processed
4. Verify user data is being created in Firestore

## Available Webhook Events

The webhook handler processes these events:

- **user.created**: Creates a new user record in Firestore
- **user.updated**: Updates existing user data in Firestore  
- **user.deleted**: Removes user record from Firestore
- **session.created**: Updates last login timestamp
- **session.ended**: Logs session end (for analytics)

## Troubleshooting

### Common Issues:

1. **Webhook verification failed**: 
   - Ensure CLERK_WEBHOOK_SECRET is correct
   - Check that the secret matches the one in Clerk dashboard

2. **Firestore permission errors**:
   - Verify Firebase configuration is correct
   - Check Firestore security rules allow authenticated writes

3. **ngrok session expired**:
   - Restart ngrok and update the webhook URL in Clerk dashboard
   - Consider using ngrok with authentication for persistent URLs

### Testing Webhook Locally

You can test the webhook endpoint directly:

```bash
curl -X POST http://localhost:3008/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test" \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: v1,test" \
  -d '{"type": "user.created", "data": {"id": "test", "email_addresses": [{"email_address": "test@example.com"}]}}'
```

## Production Setup

For production deployment:

1. Use your actual domain instead of ngrok
2. Ensure HTTPS is enabled
3. Set webhook URL to: `https://yourdomain.com/api/webhooks/clerk`
4. Update CLERK_WEBHOOK_SECRET with production secret

## Security Notes

- Never commit webhook secrets to version control
- Use different webhook secrets for development and production
- Validate all webhook payloads using Svix verification
- Log webhook events for debugging but avoid logging sensitive data