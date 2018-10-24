/*
 * Create and export configuration const iables
 *
 */

// Container for all environments
const environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: 3030,
  httpsPort: 3031,
  envName: 'staging',
  hashingSecret: 'thisIsASecret',
  stripe: 'Secret',
  mailgun: 'Secret',
  templateGlobals: {
    appName: 'UptimeChecker',
    companyName: 'NotARealCompany, Inc.',
    yearCreated: '2018',
    baseUrl: 'http://localhost:3030/'
  },
};

// Production environment
environments.production = {
  httpPort: 5030,
  httpsPort: 5031,
  envName: 'production',
  hashingSecret: 'thisIsAlsoASecret',
  stripe: 'Secret',
  mailgun: 'Secret',
  templateGlobals: {
    appName: 'UptimeChecker',
    companyName: 'NotARealCompany, Inc.',
    yearCreated: '2018',
    baseUrl: 'http://localhost:5030/'
  },
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string'
  ? process.env.NODE_ENV.toLowerCase()
  : '';

// Check that the current environment is one of the environments above, if not default to staging
const environmentToExport = typeof environments[currentEnvironment] === 'object'
  ? environments[currentEnvironment]
  : environments.staging;

// Export the module
module.exports = environmentToExport;
