# 8. Testing Checklist

## Overview
Complete testing checklist to ensure the Homesfy chat widget system works perfectly for production use at Homesfy company.

## Pre-Testing Setup

### Environment Check
- [ ] API server is running
- [ ] MongoDB is connected (or file storage working)
- [ ] Gemini API key is configured
- [ ] Widget dev server is running
- [ ] Dashboard is accessible

### Test Data
- [ ] Test property configured
- [ ] Widget config has property information
- [ ] Test phone numbers ready
- [ ] Test project IDs available

## 1. API Testing

### Health Endpoint
- [ ] `GET /health` returns 200
- [ ] Response shows `status: "ok"`
- [ ] AI availability is correct
- [ ] Model name is "gemini-2.5-flash"

### Chat API
- [ ] `POST /api/chat` accepts message
- [ ] Returns AI response
- [ ] `aiUsed: true` when AI is available
- [ ] `fallback: true` when AI unavailable
- [ ] Handles conversation history
- [ ] Uses property information
- [ ] Returns JSON action for lead request

### Leads API
- [ ] `POST /api/leads` creates lead
- [ ] Validates required fields
- [ ] Normalizes phone numbers
- [ ] Creates chat session
- [ ] Returns lead with ID
- [ ] `GET /api/leads` lists leads
- [ ] Filters by microsite
- [ ] Pagination works

### Chat Sessions API
- [ ] `GET /api/chat-sessions` lists sessions
- [ ] Filters by microsite
- [ ] Filters by leadId
- [ ] Pagination works
- [ ] Returns conversation history

### Widget Config API
- [ ] `GET /api/widget-config/:projectId` returns config
- [ ] `POST /api/widget-config/:projectId` updates config
- [ ] Property info is stored correctly
- [ ] Theme settings work

## 2. Widget Testing

### Widget Loading
- [ ] Widget loads on page
- [ ] Widget bubble appears
- [ ] Widget opens on click
- [ ] Auto-open works (if configured)
- [ ] Widget closes properly

### Chat Interface
- [ ] Welcome message displays
- [ ] CTA buttons appear
- [ ] Messages display correctly
- [ ] User messages show on right
- [ ] Agent messages show on left
- [ ] Typing indicator works
- [ ] Scroll to bottom works

### AI Conversation
- [ ] User can type message
- [ ] AI responds to questions
- [ ] Responses are contextual
- [ ] Property info is used
- [ ] Bold formatting works
- [ ] Responses are concise (2-3 sentences)
- [ ] Contact request appears after 1-2 exchanges

### Lead Capture Flow

#### CTA Selection
- [ ] CTA buttons are clickable
- [ ] Selecting CTA shows acknowledgement
- [ ] BHK selection appears

#### BHK Selection
- [ ] BHK options are clickable
- [ ] Selecting BHK shows inventory message
- [ ] Name input appears

#### Name Input
- [ ] Name field appears
- [ ] Name validation works
- [ ] Invalid names show error
- [ ] Valid name proceeds to phone

#### Phone Input
- [ ] Phone field appears
- [ ] Country code dropdown works
- [ ] Phone validation works
- [ ] Indian numbers validated (10 digits, starts with 6-9)
- [ ] International numbers validated
- [ ] Invalid phones show error
- [ ] Valid phone submits lead

#### Combined Form (AI-triggered)
- [ ] Combined form appears when AI requests
- [ ] Name and phone fields both visible
- [ ] Both fields validate
- [ ] Submit button works
- [ ] Form clears after submission

### Property Detection
- [ ] Widget detects property from page
- [ ] Property info sent to AI
- [ ] AI uses property context
- [ ] Responses include property details

### Error Handling
- [ ] Network errors show message
- [ ] API errors are handled
- [ ] Validation errors display
- [ ] User can retry on error

## 3. CRM Integration Testing

### Lead Submission
- [ ] Lead submits to CRM API
- [ ] Payload format is correct
- [ ] Project ID is correct
- [ ] Phone number format is correct
- [ ] Country code is included
- [ ] Name is included
- [ ] UTM parameters included (if present)
- [ ] Device info included
- [ ] IP address included

### CRM Response
- [ ] Success response handled
- [ ] Error response handled
- [ ] Error messages displayed
- [ ] User can retry on failure

### Local API Backup
- [ ] Lead saved to local API
- [ ] Conversation stored
- [ ] Metadata included
- [ ] Dashboard can view lead

## 4. MongoDB Storage Testing

### Data Storage
- [ ] Leads stored in MongoDB
- [ ] Chat sessions stored
- [ ] Conversations preserved
- [ ] Metadata stored correctly
- [ ] Timestamps correct

### Data Retrieval
- [ ] Can query leads by microsite
- [ ] Can query chat sessions
- [ ] Conversation history complete
- [ ] Linked to leads correctly

### Data Integrity
- [ ] No duplicate leads
- [ ] All fields populated
- [ ] Relationships maintained
- [ ] Indexes working

## 5. Dashboard Testing

### Leads Page
- [ ] Leads list displays
- [ ] Filters work (microsite, date)
- [ ] Search works
- [ ] Pagination works
- [ ] Lead details visible

### Conversation View
- [ ] Conversations display
- [ ] Full history visible
- [ ] Messages in order
- [ ] Timestamps correct
- [ ] Linked to leads

### Analytics
- [ ] Events tracked
- [ ] Metrics displayed
- [ ] Charts render
- [ ] Data accurate

## 6. End-to-End Testing

### Complete User Journey
1. [ ] User opens widget
2. [ ] User sees welcome message
3. [ ] User asks question
4. [ ] AI responds intelligently
5. [ ] AI asks for contact (after 1-2 exchanges)
6. [ ] User enters name
7. [ ] User enters phone
8. [ ] Lead submits to CRM
9. [ ] Lead appears in dashboard
10. [ ] Conversation stored in MongoDB
11. [ ] User can continue chatting

### Alternative Flow (CTA Path)
1. [ ] User selects CTA
2. [ ] User selects BHK
3. [ ] User enters name
4. [ ] User enters phone
5. [ ] Lead submits successfully

### Error Scenarios
- [ ] API unavailable - fallback works
- [ ] AI unavailable - keyword matching works
- [ ] CRM unavailable - error shown, user can retry
- [ ] Invalid phone - validation error shown
- [ ] Network error - error message shown

## 7. Performance Testing

### Response Times
- [ ] API responds in < 500ms
- [ ] AI responds in < 3 seconds
- [ ] Widget loads in < 2 seconds
- [ ] Lead submission in < 2 seconds

### Load Testing
- [ ] Handles multiple concurrent users
- [ ] MongoDB queries are fast
- [ ] No memory leaks
- [ ] Server remains stable

## 8. Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

### Features
- [ ] Widget responsive
- [ ] Touch interactions work
- [ ] Keyboard works
- [ ] Country selector works on mobile

## 9. Security Testing

### Data Security
- [ ] API keys not exposed
- [ ] MongoDB credentials secure
- [ ] CORS configured correctly
- [ ] HTTPS enabled (production)

### Input Validation
- [ ] Phone numbers validated
- [ ] Names validated
- [ ] SQL injection prevented
- [ ] XSS prevented

## 10. Production Readiness

### Configuration
- [ ] Environment variables set
- [ ] MongoDB Atlas configured
- [ ] API deployed
- [ ] Widget deployed
- [ ] Dashboard deployed

### Monitoring
- [ ] Health checks configured
- [ ] Error tracking setup
- [ ] Logging configured
- [ ] Alerts configured

### Documentation
- [ ] Setup documented
- [ ] API documented
- [ ] Troubleshooting guide
- [ ] Deployment guide

## Test Scenarios

### Scenario 1: New User Chat
```
1. User opens widget
2. Asks: "What's the price?"
3. AI responds with pricing
4. User asks: "Where is it located?"
5. AI responds with location
6. AI asks for contact details
7. User enters name: "John Doe"
8. User enters phone: "+91 9876543210"
9. Lead submits successfully
10. Verify in CRM and dashboard
```

### Scenario 2: CTA Flow
```
1. User opens widget
2. Selects CTA: "Pricing & Floor Plans"
3. Selects BHK: "2 BHK"
4. Enters name: "Jane Smith"
5. Enters phone: "+91 9876543211"
6. Lead submits successfully
7. Verify in CRM and dashboard
```

### Scenario 3: Property Detection
```
1. Widget loads on property page
2. Widget detects property info
3. User asks: "Tell me about this project"
4. AI responds with property details
5. Verify property info is accurate
```

## Common Issues & Solutions

### Issue: AI Not Responding
- Check GEMINI_API_KEY is set
- Verify API health endpoint
- Check API logs
- Test API key validity

### Issue: Leads Not Submitting
- Check CRM API endpoint
- Verify phone validation
- Check browser console
- Verify project ID

### Issue: Conversations Not Storing
- Check MongoDB connection
- Verify DATA_STORE=mongo
- Check API logs
- Verify lead submission

### Issue: Widget Not Loading
- Check API URL
- Verify CORS configuration
- Check browser console
- Verify widget bundle URL

## Sign-Off Checklist

Before going live:
- [ ] All tests passed
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Team trained
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Rollback plan ready

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor error rates
- [ ] Check lead submissions
- [ ] Verify conversations storing
- [ ] Review user feedback

### First Week
- [ ] Analyze conversion rates
- [ ] Review conversation quality
- [ ] Optimize AI responses
- [ ] Fix any issues

## Next Steps
- [ ] Complete all tests
- [ ] Fix any issues found
- [ ] Deploy to production
- [ ] Monitor post-launch
- [ ] Iterate and improve
