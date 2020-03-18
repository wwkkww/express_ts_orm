import 'dotenv/config';
import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  name: "default",
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    __dirname + '/../**/*.entity{.ts, .js}',
  ],
  migrations: [
    "src/migrations/*.ts"
  ],
  cli: {
    migrationsDir: 'src/migrations',
  }
};

export = config;

// module.exports = {
//   name: "default",
//   type: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   port: Number(process.env.POSTGRES_PORT),
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
//   entities: [
//     __dirname + '/../**/*.entity{.ts, .js}',
//   ],
//   synchronize: true,
// };