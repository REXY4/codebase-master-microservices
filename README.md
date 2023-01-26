# be-master

## Requirements

- Node.JS v16 LTS or above
- Relational Databse Server (MSSQL, MySQL, Postgres)
- MongoDB
- Redis
- RabbitMQ

## To get the Node server running locally

- Clone this repo
- `cd /path/to/cloned/repo`
- `npm install` to install all required dependencies
- Run `cp .env-example .env` and then edit a file with your fav editor, example `vi .env`
- Run `npm run sql:create` to create database
- Run `npm run sql:migrate` to build sql tables
- Run `npm run sql:seed:all` to add basic data
- Run `npm run sql:model` to build data model, stored in `src/sql-model`
- You need to setup certification for JWT usage by copying public key to `./certificates`
- Or you can generate by `node ./scripts/generate-certificate.js --encoding base64`
- `npm start` to start the local server
- The API is available at `http://localhost:3000`

## Commands
### Application
Install dependency
```sh
npm install
```

Start service
```sh
npm start
```

Start service if you are a developer
```sh
npm run start:dev
```

Build (web pages and static files)
```sh
npm run build
```

Run unit test
```sh
npm test
```

Update dependency
```sh
npm run module-update
```

Generate SQL model
```sh
npm run sql:model
```

### RDBMS
Create database
```sh
npm run sql:create
```

Drop database
```sh
npm run sql:create
```

Up migration (all)
```sh
npm run sql:migrate
```

Down/undo migration (one)
```sh
npm run sql:migrate:undo
```

Down/undo migration (all)
```sh
npm run sql:migrate:undo:all
```

Up seeding (all)
```sh
npm run sql:seed:all
```

Down/undo seeding (one)
```sh
npm run sql:seed:undo
```

Down/undo seeding (all)
```sh
npm run sql:seed:undo:all
```

### Code convention
Lint your code
```sh
npm run lint
```

Lint and fix your code
```sh
npm run lint:fix
```

### Certificate
Generate asymmetric certificate `(recommended)`
```sh
./scripts/asymmetric-keypair.sh 4096
```
> Keep it in your mind! Generating JWT is exclusive by auth service. So, only auth service can accessing the private key.
> 
> And put the shared/public key in other service, like resource service. In case for verify JWT validation

### JSON Web Token (JWT)
Generate token
```sh
node ./scripts/generate-token.js generate '{"sub":"andaikan@nodomain.com","profile":{"accountId":"1","usrRegistrantId":"1","uname":"andaikan","email":"andaikan@nodomain.com","phone":"+6286313149xxx","name":"Andaikan"},"roles":["owner"],"scope":"offline_access","client_id":"all-in-one-client","aud":"http://localhost:3001/xyz"}'
```

Decode token
```sh
node ./scripts/generate-token.js decode 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRhaWthbkBub2RvbWFpbi5jb20iLCJwcm9maWxlIjp7ImFjY291bnRJZCI6IjEiLCJ1c3JSZWdpc3RyYW50SWQiOiIxIiwidW5hbWUiOiJhbmRhaWthbiIsImVtYWlsIjoiYW5kYWlrYW5Abm9kb21haW4uY29tIiwicGhvbmUiOiIrNjI4NjMxMzE0OXh4eCIsIm5hbWUiOiJBbmRhaWthbiJ9LCJyb2xlcyI6WyJvd25lciJdLCJzY29wZSI6Im9mZmxpbmVfYWNjZXNzIiwiY2xpZW50X2lkIjoiYWxsLWluLW9uZS1jbGllbnQiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDEveHl6IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdC9vYXV0aC9hL2IvYyIsImV4cCI6MTcwMzE2NTAxOSwiaWF0IjoxNjcxNjI1MDE5fQ.VwjWqOKmcns9z0wdaKwolFveAbY96ehmTO6cizO6utLJuXStsrQd9DerIo9YY81zHc1xfAoP_ubR__uVRkk1Ecv4H0VevzM2NPvG7iwtoHsaUPLTgcZ9havrhfQcTD9lvIfBG4yffZL5BPN9FFSpoCu7KfmS7PyDgKmgekYnQLRNGclwq1Lic1z8awPXs_p_JxxUCBrvXwK1HpMGj-WnC56QIPnKD1uV9polgglmeT-dLDsIafSrec8JFc1gGlr1R0A_zO0NbfWfy7iStW03nGPwcZ0cJhu0OfMs5ZXX1ySyA11M_aNcKYRi4hZaMKDtOIDB0pbSZbg5CTpC43NGIg'
```

### Other
Run client example
```sh
# TODO: This should be on unit test
node ./scripts/call-grpc-client.js
```

Run callable service
```sh
# TODO: This should be on unit test
node ./scripts/call-services.js
```

Run callable service
```sh
# TODO: This should be on unit test
node ./scripts/call-utils.js
```
