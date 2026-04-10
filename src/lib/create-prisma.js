// This file must NOT be bundled by Turbopack
// It reads process.env at runtime
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');

let _client = null;

function getLibsqlClient() {
  if (_client) return _client;

  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL or DATABASE_URL must be set');
  }

  _client = createClient({ url, authToken });
  return _client;
}

function createAdapter() {
  return new PrismaLibSql(getLibsqlClient());
}

module.exports = { createAdapter };
