import express, { type Router } from 'express'
import { createTask, updateTask, deleteTask, getTaskById, getTasks } from '../../controllers/v1/tasks.controller'

const router: Router = express.Router()

router.post('/task', createTask)

router.put('/task/:id', updateTask)

router.delete('/task/:id', deleteTask)

router.get('/task/:id', getTaskById)

router.get('/tasks', getTasks)

export default router
