export default {
  development: {
    port: process.env.PORT || 3000,
  },
  test: {
    port: process.env.PORT || 3001,
  },
  production: {
    port: process.env.PORT || 3002,
  },
};
