# MongoDB Atlas Setup Guide

## SSL/TLS Connection Error Fix

If you're seeing `SSL handshake failed: [SSL: TLSV1_ALERT_INTERNAL_ERROR]` errors, follow these steps:

### 1. Use the Correct Connection String Format

For **MongoDB Atlas**, always use the `mongodb+srv://` protocol:

```bash
# ✅ CORRECT - Uses SRV record (handles SSL automatically)
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# ❌ WRONG - Direct connection (requires manual SSL configuration)
mongodb://ac-zohtbpq-shard-00-00.7axkvq2.mongodb.net:27017/
```

### 2. Update Your .env File

Your MONGO_URL should look like this:

```env
# MongoDB Atlas Connection
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=your_database_name
```

**Important**: Replace:
- `username` with your MongoDB Atlas username
- `password` with your MongoDB Atlas password (URL-encoded if it contains special characters)
- `cluster.mongodb.net` with your actual cluster address

### 3. Get the Correct Connection String from MongoDB Atlas

1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Database** in the left sidebar
3. Click **Connect** on your cluster
4. Select **Connect your application**
5. Choose **Python** and version **3.12 or later**
6. Copy the connection string shown (it will start with `mongodb+srv://`)
7. Replace `<password>` with your actual database user password
8. Add `?retryWrites=true&w=majority` at the end if not present

### 4. URL-Encode Special Characters in Password

If your password contains special characters, encode them:

- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`

Example:
```env
# Password: My@Pass#123
MONGO_URL=mongodb+srv://user:My%40Pass%23123@cluster.mongodb.net/?retryWrites=true&w=majority
```

### 5. Whitelist Render's IP Address

1. In MongoDB Atlas, go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (or add `0.0.0.0/0`)
4. Click **Confirm**

**Note**: For production, you should whitelist only Render's specific IP addresses.

### 6. Verify Database User Permissions

1. Go to **Database Access** in MongoDB Atlas
2. Ensure your user has **Read and write to any database** or specific database permissions
3. Make sure the user is not IP-restricted

## Testing the Connection Locally

Before deploying, test locally:

```bash
# Install dependencies
pip install motor pymongo certifi

# Test connection
python -c "from pymongo import MongoClient; import os; from dotenv import load_dotenv; load_dotenv(); client = MongoClient(os.getenv('MONGO_URL')); print('Connected:', client.server_info())"
```

## Environment Variables for Render

In your Render dashboard, set these environment variables:

1. Go to your service dashboard
2. Navigate to **Environment** tab
3. Add:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=your_database_name
   ```

4. Click **Save Changes**

## Common Issues

### Issue: "Authentication failed"
**Solution**: Verify username/password are correct and URL-encoded

### Issue: "Server selection timeout"
**Solution**: Check network access whitelist in MongoDB Atlas

### Issue: "SSL: CERTIFICATE_VERIFY_FAILED"
**Solution**: Ensure `certifi` is installed and connection string uses `mongodb+srv://`

### Issue: "No servers found"
**Solution**: Verify the cluster hostname in your connection string is correct

## SSL/TLS Configuration in Code

The application automatically detects MongoDB Atlas URLs and enables SSL:

```python
# db/connect.py handles this automatically
if "mongodb.net" in MONGO_URL:
    client_options["tls"] = True
```

No manual SSL configuration needed if you use `mongodb+srv://` connection string.

## Support

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Motor (Async Driver) Documentation](https://motor.readthedocs.io/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
