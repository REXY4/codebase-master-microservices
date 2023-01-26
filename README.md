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
