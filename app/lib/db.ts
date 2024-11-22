import { Pool } from 'pg';

export const db = new Pool({
  user: 'user',
  host: 'db',
  database: 'intervenant_manager' ,
  password:'password',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});