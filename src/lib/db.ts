import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export function initDB() {
  const ssl = process.env.NODE_ENV === 'production' ? {
    ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'ca.pem')),
    key: fs.readFileSync(path.join(process.cwd(), 'certs', 'client-key.pem')),
    cert: fs.readFileSync(path.join(process.cwd(), 'certs', 'client-cert.pem'))
  } : undefined;

  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: ssl,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });
} 