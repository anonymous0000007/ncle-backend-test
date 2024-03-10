import express, { type Router } from 'express'
import { createTask, updateTask, deleteTask, getTaskById, getTasks } from '../../controllers/v1/tasks.controller'
import CommonUtil from '../../utils/common.util'
import TaskSchema from '../../validations/task.validation'

const router: Router = express.Router()

router.post('/task', CommonUtil.validateSchema(TaskSchema), createTask)

router.put('/task/:id', CommonUtil.validateSchema(TaskSchema), updateTask)

router.delete('/task/:id', deleteTask)

router.get('/task/:id', getTaskById)

router.get('/tasks', getTasks)

export default router
