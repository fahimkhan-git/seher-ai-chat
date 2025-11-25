# 6. Conversation Storage

## Overview
All chat conversations between users and the AI agent are automatically stored in MongoDB (or file storage). This enables conversation history review, analytics, and customer support.

## Storage Flow

### 1. During Chat
- Each message is stored in widget state
- Messages include: type (user/agent), text, timestamp
- Conversation history sent to AI for context

### 2. On Lead Submission
When user submits phone number:
1. Full conversation snapshot is created
2. Conversation saved to MongoDB:
   - In `chatsessions` collection
   - Linked to lead via `leadId`
   - Includes all messages from start to submission

### 3. After Submission
- Conversation continues to be stored
- New messages appended to conversation
- Updates saved to MongoDB

## Data Structure

### Chat Session Document
```javascript
{
  _id: ObjectId,
  microsite: "nivasa-enchante",
  projectId: "5796",
  leadId: "lead-uuid-here",
  phone: "+919876543210",
  bhkType: "2 BHK",
  conversation: [
    {
      id: "msg-uuid-1",
      type: "system",  // or "user"
      text: "Hi, I'm Riya from Homesfy 👋",
      timestamp: 1763794792218
    },
    {
      id: "msg-uuid-2",
      type: "user",
      text: "What's the price?",
      timestamp: 1763794803897
    },
    {
      id: "msg-uuid-3",
      type: "system",
      text: "**2 BHK**: **₹ 79.80 Lakhs**...",
      timestamp: 1763794813486
    }
  ],
  metadata: {
    projectId: "5796",
    name: "John Doe",
    visitor: {
      utm: { source: "google", campaign: "summer_sale" },
      landingPage: "/property",
      referrer: "https://google.com",
      location: { city: "Pune", country: "India" }
    }
  },
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## Storage Implementation

### Automatic Storage
Conversations are stored automatically when:
- Lead is submitted (phone number provided)
- Chat session is created via `/api/leads` endpoint

### Storage Location
- **MongoDB**: `chatsessions` collection (if `DATA_STORE=mongo`)
- **File Storage**: `apps/api/data/chat-sessions.json` (if `DATA_STORE=file`)

### Code Flow
```javascript
// In apps/api/src/routes/leads.js
router.post("/", async (req, res) => {
  // ... create lead ...
  
  // Automatically create chat session
  await createChatSession({
    microsite,
    projectId: metadata?.projectId,
    leadId: lead.id,
    phone: normalizedPhone,
    bhkType: normalizedBhk.type,
    conversation,  // Full conversation array
    metadata: metadataPayload
  });
});
```

## Querying Conversations

### Via API
```bash
# List all chat sessions for a microsite
GET /api/chat-sessions?microsite=nivasa-enchante&limit=50

# Get sessions for specific lead
GET /api/chat-sessions?leadId=lead-uuid-here

# Pagination
GET /api/chat-sessions?microsite=nivasa-enchante&limit=20&skip=0
```

### Via MongoDB
```javascript
// Get all sessions for a microsite
db.chatsessions.find({ microsite: "nivasa-enchante" })

// Get session for specific lead
db.chatsessions.find({ leadId: "lead-uuid-here" })

// Get recent sessions
db.chatsessions.find().sort({ createdAt: -1 }).limit(10)
```

## Conversation Structure

### Message Types
- **system**: Messages from AI agent
- **user**: Messages from user

### Message Format
```javascript
{
  id: "unique-message-id",
  type: "system" | "user",
  text: "Message content",
  timestamp: 1763794792218  // Unix timestamp in milliseconds
}
```

### Conversation Array
- Ordered chronologically (oldest first)
- Includes all messages from chat start
- Preserved exactly as user experienced

## Use Cases

### 1. Customer Support
- Review full conversation history
- Understand user's questions and concerns
- Provide context for follow-up calls

### 2. Analytics
- Analyze common questions
- Identify conversion patterns
- Measure AI effectiveness
- Track user journey

### 3. Quality Assurance
- Review AI responses
- Identify areas for improvement
- Test different conversation flows
- Monitor for errors

### 4. Lead Qualification
- Understand user's interest level
- See which properties they asked about
- Review BHK preferences
- Check engagement level

## Dashboard Integration

### Viewing Conversations
Dashboard can display:
- List of chat sessions
- Full conversation history
- Linked to lead information
- Filter by microsite, date, lead

### Conversation Viewer
- Show messages in chronological order
- Highlight user vs agent messages
- Display timestamps
- Show metadata (UTM, location, etc.)

## Data Retention

### Current Implementation
- Conversations stored indefinitely
- No automatic deletion
- Can be archived or deleted manually

### Recommended Practices
- Archive old conversations (>90 days)
- Delete test conversations
- Keep production data for analysis
- Comply with data retention policies

## Privacy Considerations

### Data Stored
- User messages (all text)
- Agent responses
- Timestamps
- Metadata (UTM, location, device)

### Not Stored
- User's IP address (only in metadata if collected)
- Personal information beyond name/phone
- Sensitive data

### Compliance
- Follow GDPR/privacy regulations
- Allow data deletion requests
- Secure data storage
- Limit access to authorized users

## Backup and Recovery

### Backup Conversations
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/homesfy_chat" --collection=chatsessions

# File storage backup
cp apps/api/data/chat-sessions.json backup/
```

### Restore Conversations
```bash
# MongoDB restore
mongorestore --uri="mongodb://localhost:27017/homesfy_chat" --collection=chatsessions backup/

# File storage restore
cp backup/chat-sessions.json apps/api/data/
```

## Performance Considerations

### Indexes
MongoDB automatically creates indexes on:
- `microsite` - Fast filtering by property
- `leadId` - Fast lookup by lead
- `createdAt` - Fast sorting by date

### Query Optimization
- Use `limit` and `skip` for pagination
- Filter by `microsite` for faster queries
- Index on `leadId` for lead lookups

### Storage Size
- Average conversation: ~5-10 KB
- 1000 conversations: ~5-10 MB
- Monitor database size
- Archive old data if needed

## Troubleshooting

### Conversations Not Storing
- Check `DATA_STORE` is set correctly
- Verify MongoDB connection (if using mongo)
- Check API logs for errors
- Verify lead submission is successful

### Missing Messages
- Check conversation array includes all messages
- Verify messages are added in order
- Check for errors during storage
- Review conversation snapshot creation

### Cannot Query Conversations
- Verify API endpoint is accessible
- Check MongoDB connection
- Verify indexes are created
- Check query parameters

## Best Practices

### Conversation Quality
- Store complete conversations
- Preserve message order
- Include all metadata
- Link to leads properly

### Data Management
- Regular backups
- Archive old conversations
- Monitor storage usage
- Clean up test data

### Privacy
- Secure storage
- Limit access
- Comply with regulations
- Allow data deletion

## Next Steps
- [ ] Verify conversations are storing
- [ ] Test querying conversations
- [ ] Set up dashboard integration
- [ ] Configure backup strategy
- [ ] Proceed to Production Deployment (see `7-production-deployment.md`)
