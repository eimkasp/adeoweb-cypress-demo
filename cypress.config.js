const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '2xqgvz',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  defaultCommandTimeout: 30000,
  responseTimeout: 50000,
  chromeWebSecurity: false,
  // modifyObstructiveCode: false
  experimentalModifyObstructiveThirdPartyCode: true,
  pageLoadTimeout: 120000
})
