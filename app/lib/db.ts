import { Pool } from 'pg';

export const db = new Pool({
  user: process.env.POSTGRES_USER_NEXT,
  host: 'db',
  database: process.env.POSTGRES_DB ,
  password: process.env.POSTGRES_PASSWORD_NEXT ,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});