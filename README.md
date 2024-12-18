Avancement :

- 13/12 : Iteration 12, 13, 14, 15

### Start

```bash
docker compose up -d

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
