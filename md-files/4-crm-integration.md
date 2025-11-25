# 4. CRM Integration

## Overview
The chat widget integrates with the Homesfy CRM API to automatically submit leads when users provide their contact information. This ensures leads are immediately available in your CRM system.

## CRM API Endpoint

### Production Endpoint
```
POST https://api.homesfy.in/api/leads/create
```

### Request Format
```json
{
  "name": "John Doe",
  "email": null,
  "country_code": "+91",
  "number": "9876543210",
  "tracking_lead_id": "chat-1234567890",
  "nationality": 1,
  "source_id": 31,
  "project_id": 5796,
  "Digital": {
    "user_device": "Mobile",
    "user_browser": "Chrome",
    "campaing_type": "summer_sale",
    "launch_name": "",
    "client_ipaddress": "192.168.1.1",
    "client_pref": null
  },
  "Utm": {
    "utm_medium": "organic",
    "utm_source": "google",
    "utm_content": "ad_variant_1",
    "utm_term": "property pune"
  },
  "is_magnet": 0,
  "magnet_id": null
}
```

## Lead Submission Flow

### 1. User Provides Contact Details
- User enters name and phone number in widget
- Widget validates phone number format
- Country code is selected from dropdown

### 2. Data Preparation
Widget prepares payload with:
- **Name**: User's name
- **Phone**: Normalized phone number with country code
- **Project ID**: From widget configuration or URL parameter
- **UTM Parameters**: Extracted from URL
- **Device Info**: Browser, device type, IP address
- **Tracking ID**: Unique identifier for this lead

### 3. CRM Submission
```javascript
// In ChatWidget.jsx - submitLeadInput function
const crmPayload = {
  name: leadName,
  email: null,
  country_code: countryCode,  // e.g., "+91"
  number: phoneNumber,        // e.g., "9876543210"
  tracking_lead_id: magnetId || `chat-${Date.now()}`,
  nationality: countryCode === "+91" ? 1 : 2,  // 1 = India, 2 = Other
  source_id: magnetId ? 49 : 31,  // 49 = magnet, 31 = chat widget
  project_id: Number(projectId) || 5796,
  Digital: {
    user_device: deviceInfo,      // "Mobile", "Desktop", "Tablet"
    user_browser: browserInfo,    // "Chrome", "Firefox", etc.
    campaing_type: utmParams.utmcampaign || null,
    launch_name: "",
    client_ipaddress: clientIp,
    client_pref: null
  }
};

// Add UTM params if present
if (Object.keys(utmParams).length > 0) {
  crmPayload.Utm = {
    utm_medium: utmParams.utmmedium || null,
    utm_source: utmParams.utmsource || null,
    utm_content: utmParams.utmcontent || null,
    utm_term: utmParams.utmterm || null
  };
}

// Send to CRM
const response = await fetch("https://api.homesfy.in/api/leads/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(crmPayload)
});
```

### 4. Response Handling
- Success: Lead is created in CRM
- Error: Widget shows error message, user can retry
- Lead is also saved to local API for dashboard tracking

## Field Mappings

### Required Fields
| Widget Field | CRM Field | Description |
|------------|-----------|-------------|
| User Name | `name` | Lead's name |
| Phone Number | `number` | Phone without country code |
| Country Code | `country_code` | e.g., "+91" |
| Project ID | `project_id` | Numeric project ID |

### Optional Fields
| Widget Field | CRM Field | Description |
|------------|-----------|-------------|
| UTM Campaign | `Utm.utm_medium`, `Utm.utm_source`, etc. | Marketing attribution |
| Device Type | `Digital.user_device` | Mobile/Desktop/Tablet |
| Browser | `Digital.user_browser` | Chrome/Firefox/Safari |
| IP Address | `Digital.client_ipaddress` | User's IP |
| Magnet ID | `magnet_id` | If from magnet campaign |
| Tracking ID | `tracking_lead_id` | Unique lead identifier |

### Calculated Fields
| Field | Value | Logic |
|-------|-------|-------|
| `nationality` | 1 or 2 | 1 if country_code === "+91", else 2 |
| `source_id` | 31 or 49 | 31 for chat widget, 49 for magnet |
| `email` | null | Not collected in chat flow |

## UTM Parameter Tracking

### Automatic Extraction
Widget automatically extracts UTM parameters from URL:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

### Storage
- Stored in `visitorContext` in widget
- Sent to CRM in `Utm` object
- Also stored in local API metadata

### Example
```
URL: https://example.com/property?utm_source=google&utm_campaign=summer_sale
Result:
{
  "Utm": {
    "utm_source": "google",
    "utm_medium": null,
    "utm_campaign": "summer_sale",
    "utm_content": null,
    "utm_term": null
  }
}
```

## Phone Number Validation

### Indian Numbers (+91)
- Must be 10 digits
- Must start with 6, 7, 8, or 9
- Format: `+91 9876543210`

### International Numbers
- Minimum 4 digits
- Maximum 14 digits
- Country code from dropdown
- Format: `+1 1234567890`

### Validation Logic
```javascript
// In ChatWidget.jsx
if (countryCode === "+91") {
  if (phoneNumber.length !== 10 || !/^[6-9]/.test(phoneNumber)) {
    error = "Invalid phone number. For Indian numbers, enter a valid 10-digit number starting with 6-9.";
  }
}
```

## Error Handling

### CRM API Errors
- **400 Bad Request**: Invalid data format
- **401 Unauthorized**: Authentication failed
- **500 Server Error**: CRM system error

### Widget Error Messages
- "Failed to save lead to CRM (status_code)"
- "We couldn't save your details. Please try again."
- Phone validation errors shown immediately

### Retry Logic
- User can retry submission
- No automatic retries (user must click submit again)
- Error message persists until resolved

## Testing CRM Integration

### Test Lead Submission
1. Open widget on test page
2. Complete chat flow
3. Enter name and phone
4. Submit lead
5. Check browser console for:
   - CRM API request payload
   - CRM API response
   - Success/error messages

### Verify in CRM
1. Log into Homesfy CRM
2. Check for new lead with:
   - Correct name and phone
   - Project ID matches
   - Source shows as chat widget
   - UTM parameters (if provided)

### Test Scenarios
- ✅ Valid Indian phone number
- ✅ Valid international phone number
- ✅ With UTM parameters
- ✅ Without UTM parameters
- ✅ With magnet_id
- ✅ Different project IDs
- ❌ Invalid phone number (should show error)
- ❌ Missing required fields (should show error)

## Local API Backup

In addition to CRM, leads are also saved to local API:

```javascript
// In ChatWidget.jsx
const localPayload = {
  phone: normalizedPhone,
  bhkType: selectedBhk || "Yet to decide",
  microsite: microsite || projectId,
  metadata: {
    projectId: finalProjectId,
    name: userName,
    visitor: visitorContext,
    phoneCountry: country.name,
    phoneCountryCode: country.countryCode,
    phoneDialCode: country.code,
    phoneSubscriber: subscriber
  },
  conversation: conversationSnapshot
};

await fetch(`${apiBaseUrl}/api/leads`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(localPayload)
});
```

This ensures:
- Dashboard can display leads
- Conversation history is preserved
- Analytics and reporting available

## Production Checklist

- [ ] CRM API endpoint is accessible
- [ ] Project IDs are correct for each property
- [ ] Phone validation works for all countries
- [ ] UTM parameters are captured correctly
- [ ] Error handling works properly
- [ ] Leads appear in CRM after submission
- [ ] Local API backup is working
- [ ] Test with real phone numbers
- [ ] Verify nationality mapping (1/2)
- [ ] Verify source_id mapping (31/49)

## Troubleshooting

### Lead Not Appearing in CRM
- Check browser console for API errors
- Verify CRM API endpoint is accessible
- Check project_id is valid
- Verify phone number format
- Check CRM logs for errors

### Phone Validation Failing
- Verify country code is selected
- Check phone number format matches country
- Review validation rules in code
- Test with known valid numbers

### UTM Parameters Missing
- Check URL has UTM parameters
- Verify widget extracts from URL
- Check payload includes `Utm` object
- Verify CRM accepts UTM format

## Next Steps
- [ ] Test CRM integration
- [ ] Verify leads appear in CRM
- [ ] Configure project IDs
- [ ] Test UTM tracking
- [ ] Proceed to AI Agent setup (see `5-ai-agent-responses.md`)
