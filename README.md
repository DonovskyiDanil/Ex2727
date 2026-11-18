# Ex2727

## Run with Docker

Requirements: Docker Engine 23.0.1 or newer and Docker Compose.

From the project directory, run:

```sh
./start-dev.sh
```

The script builds and starts the client, API, PostgreSQL, and MongoDB containers,
waits for the client and API, then applies database migrations. Open
http://localhost:3000 for the application. The API health check is at
http://localhost:5001/health.

To stop the containers while keeping database data, run:

```sh
docker compose --file docker-compose-dev.yaml down
```

The development stack uses local defaults for database access and JWT signing.
Set `JWT_SECRET` and the `SMTP_*` environment variables in the shell before
starting the stack when testing email delivery. Never use the development JWT
secret in a production deployment.
