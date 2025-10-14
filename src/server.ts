import express from 'express'

// Create Express application
const app = express();

// create a health check endpoint - make sure the server is running
app.get('/health', (req, res) => {
  res.json({message: 'hello world', ireallydontcare: 'yomomma'})
}) 

// different ways to export to allow different ways of importing
// named export vs default export
export { app }

export default app
