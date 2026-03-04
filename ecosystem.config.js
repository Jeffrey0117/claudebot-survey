module.exports = {
  apps: [{
    name: 'claudebot-survey',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3456',
    cwd: 'C:\\ClaudeBot\\claudebot-survey',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
