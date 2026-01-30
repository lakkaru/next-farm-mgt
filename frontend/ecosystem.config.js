/**
 * PM2 Ecosystem Configuration for Farm Management Next.js Frontend
 * 
 * Usage:
 *   Development: pm2 start ecosystem.config.js --env development
 *   Production:  pm2 start ecosystem.config.js --env production
 *   Staging:     pm2 start ecosystem.config.js --env staging
 * 
 * Commands:
 *   pm2 logs farm-mgt-nextjs         - View logs
 *   pm2 monit                        - Monitor processes
 *   pm2 reload farm-mgt-nextjs       - Zero-downtime reload
 *   pm2 restart farm-mgt-nextjs      - Hard restart
 *   pm2 stop farm-mgt-nextjs         - Stop the app
 *   pm2 delete farm-mgt-nextjs       - Remove from PM2
 */

module.exports = {
  apps: [
    {
      // Application identity
      name: 'farm-mgt-nextjs',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',

      // Cluster mode for load balancing (recommended for VPS)
      // Use 'max' for all CPU cores, or specify a number like 2
      instances: process.env.PM2_INSTANCES || 2,
      exec_mode: 'cluster',

      // Memory management
      max_memory_restart: '500M', // Restart if memory exceeds 500MB per instance

      // Watch configuration (disabled in production)
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs', '.git'],

      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        PM2_INSTANCES: 1,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
        PM2_INSTANCES: 1,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        PM2_INSTANCES: 2,
      },

      // Logging configuration
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      combine_logs: true,
      merge_logs: true,

      // Restart behavior
      autorestart: true,
      restart_delay: 4000,        // Wait 4s before restart
      max_restarts: 10,           // Max restarts within min_uptime window
      min_uptime: '10s',          // Consider app started if running > 10s
      exp_backoff_restart_delay: 100, // Exponential backoff on repeated crashes

      // Graceful shutdown
      kill_timeout: 5000,         // Wait 5s for graceful shutdown
      wait_ready: true,           // Wait for process.send('ready')
      listen_timeout: 10000,      // Max wait time for ready signal

      // Source maps for error tracking
      source_map_support: true,

      // Process title for easy identification
      node_args: '--max-old-space-size=512',
    },
  ],

  // PM2 Deploy configuration (optional - for `pm2 deploy`)
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/next-farm-mgt.git',
      path: '/var/www/farm-mgt-frontend',
      'pre-deploy-local': 'echo "Deploying to production..."',
      'post-deploy': 'npm ci --production=false && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/farm-mgt-frontend/logs',
      env: {
        NODE_ENV: 'production',
      },
    },
    staging: {
      user: 'deploy',
      host: ['your-staging-server-ip'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/next-farm-mgt.git',
      path: '/var/www/farm-mgt-staging',
      'post-deploy': 'npm ci --production=false && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
