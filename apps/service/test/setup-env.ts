const databaseUrl = process.env.TEST_DATABASE_URL
if (!databaseUrl?.startsWith('mysql://'))
  throw new Error('Set TEST_DATABASE_URL to a dedicated MySQL database with migrations applied.')

// Never fall back to a developer's normal database when running integration tests.
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = databaseUrl
process.env.JWT_SECRET = 'propet-integration-test-secret'
