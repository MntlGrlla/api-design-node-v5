// userRoutes.ts
import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ users: [{name: 'user1'}, {name: 'user2'}]})
})

router.get('/:id', (req, res) => {
  res.json({ user: `user with id: ${req.params.id}`})
})

// wouldn't want anyone with the api to create a user

router.put('/:id', (req, res) => {
  res.json({ message: 'updated user' })
})

router.delete('/:id', (req, res) => {
  res.json({ message: `deleted user with id: ${req.params.id}`})
})

export default router
