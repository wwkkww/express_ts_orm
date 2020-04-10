## Start postgres docker
- stop local postgres server (if any) to release port:5432
- run `docker-compose up`
- pgadmin url: localhost:8080
- refer docker.env for login credential


## TYPEORM
### create new migration file (write the Up & Down method manually)
### eg: ` await queryRunner.query(`ALTER TABLE "user" RENAME "name" to "fullName"`)`
- npm run typeorm:cli -- migration:create -n ChangeNameToFullName

### Automaitcally generate migration file after changes made to schema (eg: update column `name` to `fullName` in User schema)
--npm run typeorm:cli -- migration:generate -n ChangeNameToFullName 

### run the migration
- npm run typeorm:cli -- migration:run

### rollback migration
- npm run typeorm:cli -- migration:revert