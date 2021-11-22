# Launchpad MVP Backend

## Installation

Create PostgreSQL connection (you can run `docker-compose up -d`) and create .env file by .env.example template. Then,

```bash
$ npm i
$ npm run build
$ npm run typeorm migration:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Tests

```bash
# unit tests
$ npm run test

# unit tests with coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e
```

## Format code

```bash
# prettier format
$ npm run format

# eslint format
$ npm run lint
```

## Swagger document

Once the application has been launched, try to open [/docs](http://localhost:3000/docs/) link right from the browser.
