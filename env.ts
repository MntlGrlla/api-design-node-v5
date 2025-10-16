import { error } from 'console'
import { env as loadEnv } from 'custom-env'
import { z } from 'zod'

// APP_STAGE is treated as the stage that the app is in dev | staging | prod
// NODE_ENV is more so for running optimizations than setting the 'stage'
// if NODE_ENV is set to production (it can be even in dev), it will do some optimizations
process.env.APP_STAGE = process.env.APP_STAGE || 'dev'

// helpers
const isProduction = process.env.APP_STAGE === 'production'
const isDevelopment = process.env.APP_STAGE === 'dev'
const isTesting = process.env.APP_STAGE === 'test'

if (isDevelopment) {
  loadEnv() // loads the local .env file
}
else if (isTesting) {
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

  // number of rounds for bcrypt, 10 and 20 are arbitrary, no real decision
  // behind them.
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12), 
})

// exporting the type from zod's infer method that infers a type from 
// a zod schema or object. 
export type Env = z.infer<typeof envSchema>

let env: Env

try {
  // this will parse the kv pairs from process.env into our envSchema.
  // if any of the values from our environment that get parsed into our
  // schema, it will fail and our environment variables will have been
  // set incorrectly
  env = envSchema.parse(process.env)
} catch (e) {
  // if the error is because of a failed parse meaning validation failed
  if (e instanceof z.ZodError) {
    console.log('Invalid env var')
    // stringifies the json object into a readable format
    console.log(JSON.stringify(z.flattenError(e).fieldErrors, null, 2));

    // log each error (issue) 
    e.issues.forEach(iss => {
      const path = iss.path.join('.')
      console.log(`${path}: ${iss.message}`)
    })

    // kill the server
    process.exit(1)
  }
  // not a zod error
  throw e
}

export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'dev'
export const isTest= () => env.APP_STAGE === 'test'

export { env }
export default env
