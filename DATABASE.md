# Database Architecture

## MongoDB Driver Stack

```
FastAPI (async) → Motor (async driver) → PyMongo (sync driver) → MongoDB
```

### Configuration

- **Motor**: 3.3.2 (Async MongoDB driver for Python)
- **PyMongo**: 4.6.1 (Included as Motor dependency)
- **Client**: AsyncIOMotorClient (NOT MongoClient)
- **Database**: AsyncIOMotorDatabase

### Why Motor + AsyncIOMotorClient?

1. **Async/Await Support**: Native async operations compatible with FastAPI
2. **Non-Blocking**: Doesn't block the event loop during database operations
3. **Better Performance**: Handles concurrent requests efficiently
4. **FastAPI Best Practice**: Recommended for production FastAPI applications

### Implementation

All database operations use:
- `await` for async execution
- `AsyncIOMotorDatabase` for database reference
- `AsyncIOMotorClient` for connection (defined in `db/connect.py`)
- No direct `MongoClient` usage anywhere in the codebase

### Collections

- `users` - User accounts and authentication
- `courses` - Course metadata and structure
- `sections` - Course sections with content and MCQs
- `prompts` - User prompts for course generation
- `responses` - Generated responses (legacy)

### Connection

Managed in `db/connect.py`:
```python
from motor.motor_asyncio import AsyncIOMotorClient
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
```

All routes/services get database via dependency injection:
```python
database = Depends(get_database)
```
