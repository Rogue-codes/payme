import { DataSource } from 'typeorm';
import { join } from 'path';

const AppDataSource = new DataSource({
  type: 'mysql', // or 'postgres', 'sqlite', etc.
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'jay@daniel99',
  database: process.env.DB_NAME || 'payme',
  synchronize: false, // Avoid using in production; use migrations instead
  logging: true,
  entities: [join(process.cwd(), 'dist/**/*.entity.js')],
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
  subscribers: [],
});

export default AppDataSource;
