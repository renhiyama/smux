const withPWA = require('next-pwa')({
  dest: 'public',
})

module.exports = (process.env.NODE_ENV=="production")?withPWA({
  // next.js config
}):{}