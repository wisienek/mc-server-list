# database

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test database` to execute the unit tests via [Jest](https://jestjs.io).


## Generating migrations

To generate migrations run this command:
```bash
ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./libs/backend/database/src/cli-data-source/app.ts ./libs/backend/database/src/lib/migrations/{{migrationName}}
```
