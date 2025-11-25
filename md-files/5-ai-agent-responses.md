# 5. AI Agent Responses Configuration

## Overview
The chat widget uses Google's Gemini AI (gemini-2.5-flash) to provide intelligent, contextual responses to user questions. The AI understands user intent, searches through property information, and guides users toward lead conversion.

## AI Configuration

### Gemini API Setup

#### Step 1: Get API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create new API key
4. Copy the API key

#### Step 2: Configure in API
Edit `apps/api/.env`:
```env
GEMINI_API_KEY=your-actual-api-key-here
```

#### Step 3: Verify Setup
```bash
curl http://localhost:4000/health
```

Response should show:
```json
{
  "status": "ok",
  "ai": {
    "available": true,
    "model": "gemini-2.5-flash",
    "mode": "full-ai"
  }
}
```

## How AI Works

### 1. Message Processing
When user sends a message:
1. Widget sends to `/api/chat` with:
   - User message
   - Conversation history (last 8 messages)
   - Property information (if detected)
   - Project ID and microsite

### 2. AI Response Generation
AI uses:
- **System Prompt**: Defines agent personality and behavior
- **Property Context**: All property details (name, location, pricing, BHK, amenities)
- **Conversation History**: Previous messages for context
- **User Intent**: Understands what user is asking

### 3. Response Format
AI returns:
- **Plain Text**: Regular conversational response
- **JSON Action**: Structured action (e.g., `request_lead_details`)

## AI Behavior

### Sales-Focused Approach
The AI is configured to:
- Answer questions briefly (2-3 sentences)
- Use **bold** for key terms (project name, location, BHK, price)
- Guide users toward sharing contact details
- Create urgency with special offers
- Be persuasive but friendly

### Response Examples

#### First Response
```
**Nivasa Enchante** in **Dhanori - Lohegaon, Pune** offers **2 BHK** from **₹ 79.80 Lakhs** and **3 BHK** from **₹ 1.04 Cr**. Share your name and phone number, I'll get you **exclusive pricing**! 💰
```

#### After 1-2 Exchanges
```
**2 BHK**: **₹ 79.80 Lakhs**, **3 BHK**: **₹ 1.04 Cr**. Share your name and phone number for **best deals** and expert consultation.
```

#### Location Question
```
**Dhanori - Lohegaon, Pune** - great connectivity! Share your name and phone number, I'll send **location highlights** and **best pricing**.
```

## Property Context

### What AI Knows
The AI has access to:
- Project name
- Developer name
- Location
- Available BHK configurations
- Pricing for each BHK
- Amenities list
- Special offers
- Area and possession details

### How It's Used
- AI searches through property info to answer questions
- Connects related information naturally
- Provides accurate pricing and availability
- Mentions special offers when relevant

## Lead Conversion Strategy

### Conversation Flow
1. **First Message**: Answer question + mention value + ask for contact
2. **After 1-2 Exchanges**: Always ask for contact details
3. **If User Hesitates**: Reassure and mention benefits
4. **After Contact Provided**: Acknowledge and confirm next steps

### Contact Request Triggers
AI asks for contact when:
- User shows interest (asks about pricing, site visit)
- After agent's second response
- User asks specific questions about property
- Conversation has 2+ messages

### JSON Action Format
When AI wants to collect contact:
```json
{
  "type": "request_lead_details",
  "message": "I'd love to send you **exclusive pricing**! Please share your contact details below."
}
```

Widget detects this and shows lead capture form.

## Fallback Mode

### When AI is Unavailable
If `GEMINI_API_KEY` is not set or invalid:
- Widget uses keyword matching
- Still provides helpful responses
- Uses property information
- Guides toward contact collection

### Fallback Examples
- "pricing" → Shows pricing from property info
- "location" → Shows location details
- "bhk" → Lists available BHK options
- Generic → Asks for contact details

## Customization

### Agent Name
Configure in widget config:
```javascript
{
  "agentName": "Riya"  // or any name
}
```

### Response Style
Modify system prompt in `apps/api/src/routes/chat.js`:
- Change tone (friendly, professional, etc.)
- Adjust response length
- Modify conversion strategy
- Update examples

### Property Information
Update via widget config API:
```bash
POST /api/widget-config/:projectId
{
  "propertyInfo": {
    "projectName": "Nivasa Enchante",
    "location": "Dhanori - Lohegaon, Pune",
    "availableBhk": ["2 BHK", "3 BHK"],
    "pricing": {
      "2 BHK": "₹ 79.80 Lakhs",
      "3 BHK": "₹ 1.04 Cr"
    },
    "amenities": ["Swimming Pool", "Gym", "Park"],
    "specialOffers": "Pay 20% Now & Rest on Possession"
  }
}
```

## Testing AI Responses

### Test Scenarios
1. **Greeting**: "Hi" → Should greet and introduce property
2. **Pricing Question**: "What's the price?" → Should show pricing and ask for contact
3. **Location Question**: "Where is it?" → Should show location and ask for contact
4. **BHK Question**: "What BHK available?" → Should list BHK and ask for contact
5. **Brief Details**: "Tell me about the project" → Should provide overview
6. **After 2 Exchanges**: Should request contact details

### Verification
- Check response includes property information
- Verify **bold** formatting for key terms
- Confirm contact request after 1-2 exchanges
- Test with different property configurations

## Performance

### Response Time
- Average: 1-2 seconds
- Model: gemini-2.5-flash (optimized for speed)
- Token limit: 75 tokens (keeps responses concise)

### Cost Optimization
- Uses gemini-2.5-flash (cost-effective)
- Limits conversation history (last 8 messages)
- Concise responses (2-3 sentences)
- Efficient property context formatting

## Troubleshooting

### AI Not Responding
- Check `GEMINI_API_KEY` is set correctly
- Verify API health endpoint shows AI available
- Check API logs for errors
- Test API key at https://makersuite.google.com/app/apikey

### Responses Not Contextual
- Verify property information is in widget config
- Check property info is sent in API request
- Review system prompt includes property context
- Test with different property configurations

### Not Asking for Contact
- Check conversation length (should ask after 2 exchanges)
- Verify system prompt includes contact request logic
- Review JSON action detection in widget
- Test with longer conversations

### Fallback Mode Active
- Check `GEMINI_API_KEY` in `.env`
- Verify API key is valid
- Check API logs for initialization errors
- Restart API server after setting key

## Best Practices

### Property Information
- Keep property info up to date
- Include all relevant details
- Format pricing clearly
- List key amenities

### Response Quality
- Monitor user interactions
- Review conversation logs
- Adjust system prompt as needed
- Test with real user questions

### Conversion Optimization
- Track contact request timing
- Monitor conversion rates
- Adjust prompt based on data
- A/B test different approaches

## Next Steps
- [ ] Set up Gemini API key
- [ ] Test AI responses
- [ ] Configure property information
- [ ] Verify lead conversion flow
- [ ] Proceed to Conversation Storage (see `6-conversation-storage.md`)
