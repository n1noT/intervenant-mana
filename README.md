Avancement :

- Final : 16

### Env
```bash
openssl rand -base64 32
```

Set AUTH_SECRET with the result.

```bash
AUTH_SECRET=
AUTH_URL=http://localhost:3000

POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=intervenant_manager

POSTGRES_USER_NEXT=user_app
POSTGRES_PASSWORD_NEXT=password_app

PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin
```

### Start

```bash
docker compose up -d
```

or start for prod with :

```bash
docker-compose -f docker-compose.prod.yaml --env-file .env up -d --build
```

### Implement db user
1. Go on pgadmin
2.Connect to db (defined in env):
    - host : db
    - user: user
    - password : password
    

3. Create tables
4. Create user app (defined in env):
    - user: user_app
    - password : password_app
5. Attribute privileges to user in Properties of database

### See project

Front : http://localhost:3000
Backoffice: http://localhost:5050
