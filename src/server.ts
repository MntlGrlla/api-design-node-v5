import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import userRoutes from './routes/userRoutes.ts'

// Create Express application
const app = express();

// create a health check endpoint - make sure the server is running
app.get('/health', (req, res) => {
  res.send('<button>clickme</button')
}) 

// loads up auth routes, so following /api/auth/... will then use the 
// routes configured in the authRoutes router
app.use('/api/auth', authRoutes)

// same for the next two
app.use('/api/user/', userRoutes)
app.use('/api/habits/', habitRoutes)

// different ways to export to allow different ways of importing
// named export vs default export
export { app }

export default app
