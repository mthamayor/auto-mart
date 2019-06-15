export default {
  development: 'postgres://postgres@127.0.0.1:5432/auto_mart',
  test: 'postgres://postgres@127.0.0.1:5432/auto_mart',
  production: process.env.DATABASE_URL || 'postgres://postgres@127.0.0.1:5432/auto_mart',
};
