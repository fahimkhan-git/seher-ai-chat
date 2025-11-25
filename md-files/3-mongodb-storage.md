# 3. MongoDB Storage Setup

## Overview
MongoDB is used to store chat conversations, leads, events, and widget configurations. This ensures data persistence and enables advanced querying and analytics.

## Why MongoDB?

### Benefits
- **Persistent Storage**: Data survives server restarts
- **Scalability**: Handles large volumes of conversations
- **Querying**: Advanced filtering and search capabilities
- **Production Ready**: Required for production deployments (Vercel, etc.)

### Collections

1. **leads** - Lead information
   - Phone number, BHK preference, microsite
   - Metadata (project ID, visitor info, UTM params)
   - Conversation history
   - Status (new, contacted, qualified, closed)

2. **chatsessions** - Chat conversations
   - Full conversation history
   - Linked to lead via `leadId`
   - Project and microsite information
   - Timestamps

3. **events** - Analytics events
   - Widget interactions
   - User actions
   - Tracking data

4. **widgetconfigs** - Widget configurations
   - Theme settings
   - Property information
   - Agent configuration

## Setup Options

### Option 1: Local MongoDB

#### Installation (macOS)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Installation (Linux)
```bash
# Follow MongoDB installation guide for your distribution
# https://www.mongodb.com/docs/manual/installation/
```

#### Connection String
```env
MONGO_URI=mongodb://localhost:27017/homesfy_chat
```

### Option 2: MongoDB Atlas (Cloud - Recommended)

#### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier available)

#### Step 2: Configure Database Access
1. Go to "Database Access"
2. Create database user
3. Set username and password
4. Save credentials securely

#### Step 3: Configure Network Access
1. Go to "Network Access"
2. Add IP address:
   - For development: `0.0.0.0/0` (allows all IPs)
   - For production: Add specific IPs
3. Save

#### Step 4: Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `homesfy_chat`

#### Connection String Format
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority
```

## Configuration

### Update API `.env`
```env
DATA_STORE=mongo
MONGO_URI=mongodb://localhost:27017/homesfy_chat
# OR for Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority
```

### Verify Connection
1. Start API server: `cd apps/api && npm run dev`
2. Check logs for connection status:
   - ✅ Success: "Connected to MongoDB"
   - ❌ Error: Check connection string and network access

## Data Models

### Lead Model
```javascript
{
  phone: String (indexed),
  bhkType: String (enum: "1 BHK", "2 BHK", etc.),
  bhk: Number,
  microsite: String (indexed),
  leadSource: String (default: "ChatWidget"),
  status: String (enum: "new", "contacted", "qualified", "closed"),
  metadata: Object (projectId, visitor info, UTM params),
  conversation: Array (message history),
  createdAt: Date,
  updatedAt: Date
}
```

### ChatSession Model
```javascript
{
  microsite: String (indexed),
  projectId: String,
  leadId: String (indexed),
  phone: String,
  bhkType: String,
  conversation: Array (full message history),
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Migration from File Storage

If you have existing data in JSON files:

### Run Migration Script
```bash
# From project root
npm run migrate:file-to-mongo
```

This script:
- Reads data from `apps/api/data/*.json`
- Imports into MongoDB
- Skips documents already imported
- Preserves all data and relationships

### Manual Migration
1. Export data from JSON files
2. Use MongoDB Compass or `mongoimport` to import
3. Verify data integrity

## Querying Data

### Using MongoDB Compass
1. Download: https://www.mongodb.com/products/compass
2. Connect using your `MONGO_URI`
3. Browse collections and query data

### Using MongoDB Shell
```bash
mongosh "mongodb://localhost:27017/homesfy_chat"

# List collections
show collections

# Query leads
db.leads.find({ microsite: "nivasa-enchante" })

# Query chat sessions
db.chatsessions.find({ leadId: "lead-id-here" })

# Count documents
db.leads.countDocuments()
```

### Using API Endpoints
```bash
# List leads
GET /api/leads?microsite=nivasa-enchante&limit=50

# List chat sessions
GET /api/chat-sessions?microsite=nivasa-enchante&limit=50
```

## Backup and Recovery

### Backup
```bash
# Local MongoDB
mongodump --uri="mongodb://localhost:27017/homesfy_chat" --out=/backup/path

# MongoDB Atlas
# Use Atlas UI: Clusters → Backup → Create Backup
```

### Restore
```bash
# Local MongoDB
mongorestore --uri="mongodb://localhost:27017/homesfy_chat" /backup/path

# MongoDB Atlas
# Use Atlas UI: Clusters → Backup → Restore
```

## Production Considerations

### Indexes
The models include indexes for:
- `leads.phone` + `leads.microsite` (compound index)
- `leads.microsite` (single field)
- `chatsessions.microsite` (single field)
- `chatsessions.leadId` (single field)

### Performance
- Indexes are automatically created
- Use `limit` and `skip` for pagination
- Monitor query performance in MongoDB Atlas

### Security
- Use strong database passwords
- Restrict network access to known IPs
- Enable MongoDB authentication
- Use connection string with credentials

## Troubleshooting

### Connection Failed
- Verify MongoDB is running (local) or cluster is active (Atlas)
- Check connection string format
- Verify network access (Atlas)
- Check firewall settings

### Data Not Appearing
- Verify `DATA_STORE=mongo` in `.env`
- Check API logs for errors
- Verify collection names match models
- Check indexes are created

### Migration Issues
- Verify source JSON files exist
- Check file permissions
- Verify MongoDB connection
- Review migration script logs

## Next Steps
- [ ] Set up MongoDB (local or Atlas)
- [ ] Configure `MONGO_URI` in API `.env`
- [ ] Test connection
- [ ] Migrate existing data (if any)
- [ ] Proceed to CRM integration (see `4-crm-integration.md`)
