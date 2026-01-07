module.exports = {
  apps: [
    {
      name: 'ultimate-express-trading-service',
      script: 'bun',
      args: 'dist/index.js',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
