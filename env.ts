import { env as loadEnv } from 'custom-env'
import { z } from 'zod'

// APP_STAGE is treated as the stage that the app is in dev | staging | prod
// NODE_ENV is more so for running optimizations than setting the 'stage'
// if NODE_ENV is set to production (it can be even in dev), it will do some optimizations
process.env.APP_STAGE = process.env.APP_STAGE || 'dev'

// helpers
const isProduction = process.env.APP_STAGE === 'production'
const isDev = process.env.APP_STAGE === 'dev'
const isTest = process.env.APP_STAGE === 'test'

if (isDev) {
  loadEnv() // loads the local .env file
}
else if (isTest) {
  loadEnv('test') // loads the local .env.test file
}
// not loading a 'production' .env file 
// if we had a local .env file for production, it would need to be
// checked into the github repo in order for it to be referenced and
// injected. if I do that, then that file will be visible to everyone
// that sees where the code is. 
// Also, the hosting provider will have some sort of options for env
// variables built-in that I could modify if necessary.

// I've seen zod before. It's basically runtime type-checking.
// I create a schema to define a type and can do fun stuff with 
// it.
const envSchema = z.object({
  NODE_ENV: z.
    enum(['development', 'test', 'production'])
    .default('development'),

  APP_STAGE: z.
    enum(['dev', 'test', 'production'])
    .default('dev'),

  // most if not all env variables are going to be strings. I can use
  // fancy thing called coerce which will take the string value and 
  // 'coerce' it into a number. I'll make it positive, and then 
  // set default to be 3000
  PORT: z.coerce.number().positive().default(3000),

  // Some validation involved to make sure that the protocol ('postgresql://')
  // refers to a postgresql protocol. Basically saying: 'make sure the database
  // url actually refers to a potential postgresql database'
  // Ports can be pretty much whatever. There's HTTP, file, etc. 
  // PostgreSQL has its own protocol which just so happens to be 'postgresql://'
  DATABASE_URL: z.string().startsWith('postgresql://'),

  // More validation, making sure the JWT secret is at least 32 char long
  JWT_SECRET: z.string().min(32, 'Must be 32 chars long'),
  JWT_EXPIRES_IN: z.string().default('7d'),


})
