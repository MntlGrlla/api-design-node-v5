import { app } from './server.ts'

app.listen(3000, () => {
  // callback to do something once server is on
  console.log('server running on port: 3000')
})
