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
## Production builds

Use Bun 1.3.14 and the committed `bun.lock`: `bun install --frozen-lockfile`.
Run `bun test`, `bunx prisma generate`, and `bun run build` before deployment.
The Docker image uses a standalone Next.js build, runs as the unprivileged `bun`
user, and checks `/api/health`. Supply application secrets only at runtime; `.env`
files are excluded from the image. Schema migrations must be reviewed and run
separately with an administrative database connection; image builds do not modify
production data. The runtime database account needs SELECT on `admin` and CRUD on
`race`, `racer`, `run`, and `settings`, but no superuser or schema-creation rights.

After a suspected compromise, rotate database, session/ingestion, and OAuth
secrets. `AUTH_SECRET` is also used by the timing client, so update that client when
rotating it. Do not redeploy an old vulnerable image as a rollback. Keep the
application stopped until the replacement and credentials have been verified.
