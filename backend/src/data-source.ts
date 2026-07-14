import "reflect-metadata";
import { DataSource } from "typeorm";
import configuration from "./lib/configuration";
import path from "node:path";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: path.join(__dirname, "..", `${configuration.database.database}.db`),
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "entities/**/*.{js,ts}")],
  migrations: [path.join(__dirname, "migrations/**/*.{js,ts}")],
  extra: {
    max: 20,
    min: 5,
    idle_in_transaction_session_timeout: 30000,
  },
});
