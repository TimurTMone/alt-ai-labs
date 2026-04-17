module.exports = {
  apps: [
    {
      name: "altailabs-club-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3010",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "768M",
      autorestart: true,
      watch: false,
    },
    {
      name: "altailabs-club-api",
      script: "index.js",
      cwd: __dirname + "/server",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3011",
      },
      max_memory_restart: "512M",
      autorestart: true,
      watch: false,
    },
  ],
};
