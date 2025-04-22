# Ski System Frontend + Backend
## Development

### Setup Guide
Prerequisites:
- [Bun](https://bun.sh/) - JavaScript runtime like Node.js, but faster and more efficient.

1. Enter the webapp directory
```bash
cd webapp
```
2. Install dependencies
```bash
bun i
```
3. Start the development server
```bash
bun dev
```

The dev server will be running on `http://localhost:3000`

## Production
Best deployed on Vercel.

### Environment Variables
- `DATABASE_URL` - The Database connection string of the PostgreSQL database with pgbouncer and connectionlimit.
- `DIRECT_RUL` - The Database connection string of the PostgreSQL database.
- `AUTH_SECRET` - A secret key to authenticate the Raspberry Pi. Make sure this is the same as in statemachine/.env on the raspberry pi.