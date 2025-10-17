import { DataSource } from "typeorm";
import 'dotenv/config';
import { User } from "./users/user.entity";
import { Client } from "./clients/client.entity";
import { Transaction } from "./transactions/transaction.entity";    

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: true,
  entities: [User, Client, Transaction],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});