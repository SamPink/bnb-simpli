# Brown & Brown Acturis Assistant API Guide

This guide explains how to use the Acturis Assistant API to get help with Acturis-related questions.

## Quick Start

The API has three main concepts:
- **User ID**: Identifies each user (e.g., "john.doe@example.com")
- **Session/Run ID**: Groups related messages in a conversation
- **Chat History**: Maintains context of your conversations

## API Endpoints

### 1. Ask a Question (POST /chat)

This is the main endpoint for asking questions about Acturis.

```bash
POST https://bnb.gentlesand-b0965d81.westeurope.azurecontainerapps.io/chat
Headers: X-API-Key: your-api-key

{
    "message": "How do I process a cancellation?",
    "user_id": "john.doe@example.com",
    "run_id": "optional-session-id"  // Optional: API creates one if not provided
}
```

Response:
```json
{
    "response": "To process a cancellation in Acturis...",
    "sources": [
        {
            "document": "Cancellations.pdf",
            "page": 3,
            "paragraph": 2,
            "text": "Navigate to the 'Cancellations' module...",
            "metadata": {
                "size": 204800,
                "last_modified": "2023-09-30T10:15:00",
                "file_type": "PDF"
            }
        }
    ],
    "pdf_path": "highlighted_pdfs/john.doe@example.com/session123_highlighted.pdf"
}
```

The response includes:
- Answer to your question
- Sources used (document, page, paragraph)
- Path to a PDF with relevant sections highlighted

### 2. View Your Chat Sessions (GET /chats)

See all your previous chat sessions.

```bash
GET https://bnb.gentlesand-b0965d81.westeurope.azurecontainerapps.io/chats?user_id=john.doe@example.com
Headers: X-API-Key: your-api-key
```

Response:
```json
{
    "chats": [
        {
            "session_id": "session123",
            "created_at": "2023-10-01T12:00:00"
        },
        {
            "session_id": "session124",
            "created_at": "2023-10-02T15:30:00"
        }
    ]
}
```

### 3. View Chat History (GET /chats/{session_id})

See the full conversation history for a specific chat session.

```bash
GET https://bnb.gentlesand-b0965d81.westeurope.azurecontainerapps.io/chats/session123?user_id=john.doe@example.com
Headers: X-API-Key: your-api-key
```

Response:
```json
{
    "chat_id": "session123",
    "history": [
        {
            "role": "user",
            "content": "How do I process a cancellation?",
            "sources": null,
            "pdf_path": null
        },
        {
            "role": "assistant",
            "content": "To process a cancellation in Acturis...",
            "sources": [
                {
                    "document": "Cancellations.pdf",
                    "page": 3,
                    "paragraph": 2,
                    "text": "Navigate to the 'Cancellations' module...",
                    "metadata": {
                        "size": 204800,
                        "last_modified": "2023-09-30T10:15:00",
                        "file_type": "PDF"
                    }
                }
            ],
            "pdf_path": "highlighted_pdfs/john.doe@example.com/session123_highlighted.pdf"
        }
    ]
}
```

### 4. Download Highlighted PDF (GET /download_pdf)

Download a PDF with relevant sections highlighted.

```bash
GET https://bnb.gentlesand-b0965d81.westeurope.azurecontainerapps.io/download_pdf?user_id=john.doe@example.com&run_id=session123
Headers: X-API-Key: your-api-key
```

Response: Downloads the highlighted PDF file.

## How Conversations Work

1. **Starting a Conversation**
   - Make a POST request to /chat with your question and user_id
   - You can optionally provide a run_id to continue an existing conversation
   - If no run_id is provided, a new conversation is started

2. **Conversation History**
   - The API maintains context of your conversations
   - Each response includes sources and highlighted PDFs
   - You can view past conversations using the /chats endpoint
   - You can see full conversation history using /chats/{session_id}

3. **User and Session Management**
   - Your user_id identifies you (typically your email)
   - Each conversation gets a unique session_id (run_id)
   - All your PDFs are stored in a user-specific folder
   - You can have multiple conversations (sessions) active

## Example Workflow

1. **Ask Initial Question**
```bash
POST /chat
{
    "message": "How do I process a cancellation?",
    "user_id": "john.doe@example.com"
}
```

2. **Follow-up Question (Using session_id from first response)**
```bash
POST /chat
{
    "message": "What happens after I submit it?",
    "user_id": "john.doe@example.com",
    "run_id": "session123"
}
```

3. **View Conversation History**
```bash
GET /chats/session123?user_id=john.doe@example.com
```

4. **Download Highlighted PDF**
```bash
GET /download_pdf?user_id=john.doe@example.com&run_id=session123
```

## Tips

1. **Maintaining Context**
   - Use the same run_id for related questions
   - Start a new session (omit run_id) for unrelated topics

2. **Viewing Sources**
   - Each response includes source documents and page numbers
   - Download highlighted PDFs to see exact references
   - Sources are preserved in chat history

3. **Managing Sessions**
   - List your sessions using /chats
   - View full conversation history using /chats/{session_id}
   - Each session maintains its own context and history

## Common Questions

1. **How do I start a new conversation?**
   - Simply omit the run_id when making a /chat request
   - The API will create a new session automatically

2. **How do I continue a conversation?**
   - Include the run_id from your previous interaction
   - The API will maintain context from previous messages

3. **Can I have multiple conversations?**
   - Yes, each session (run_id) is independent
   - You can switch between sessions by using different run_ids
   - All sessions are tied to your user_id

4. **How do I find my previous conversations?**
   - Use GET /chats to list all your sessions
   - Each session shows its creation time
   - Use GET /chats/{session_id} to view specific conversations

5. **What happens to the highlighted PDFs?**
   - PDFs are stored in user-specific folders
   - Each response includes a pdf_path
   - Use the /download_pdf endpoint to retrieve them
   - PDFs are preserved and can be accessed later
