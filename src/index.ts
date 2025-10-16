import { app } from './server.ts'
import { env } from '../env.ts'

app.listen(env.PORT, () => {
  // callback to do something once server is on
  console.log(`server running on port: ${env.PORT}`)
})
