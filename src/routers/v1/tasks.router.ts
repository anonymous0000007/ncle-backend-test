import express, { type Router } from 'express'
import { type Logger, getLogger } from 'log4js'
import TaskController from '../../controllers/v1/tasks.controller'
import CommonUtil from '../../utils/common.util'
import TaskSchema from '../../validations/task.validation'
import type Task from '../../interfaces/task.interface'
import ResponseDto from '../../dtos/response.dto'
import HTTPStatus from '../../enums/http-status.enum'
import ResponseMessage from '../../enums/response-messages.enum'

const logger: Logger = getLogger('tasks.router.ts')
logger.level = 'debug'

const router: Router = express.Router()

router.post('/task', CommonUtil.validateSchema(TaskSchema), (req: any, res: express.Response): void => {
  try {
    logger.info(`req=${req.id} task creation router`)

    const responseDto: ResponseDto = new TaskController().createTask(req.id as string, req.body as Task)
    res.status(responseDto.$status as number).send(responseDto)
  } catch (error) {
    logger.error(`req=${req.id} task creation router error=${(error as any)?.stack}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
})

router.put('/task/:id', CommonUtil.validateSchema(TaskSchema), (req: any, res: express.Response): void => {
  try {
    logger.info(`req=${req.id} task update router`)

    const responseDto: ResponseDto = new TaskController().updateTask(req.id as string, req?.params?.id as string, req.body as Task)
    res.status(responseDto.$status as number).send(responseDto)
  } catch (error) {
    logger.error(`req=${req.id} task update router error=${(error as any)?.stack}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
})

router.delete('/task/:id', (req: any, res: express.Response): void => {
  try {
    logger.info(`req=${req.id} task delete router`)

    const responseDto: ResponseDto = new TaskController().deleteTask(req.id as string, req?.params?.id as string)
    res.status(responseDto.$status as number).send(responseDto)
  } catch (error) {
    logger.error(`req=${req.id} task delete router error=${(error as any)?.stack}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
})

router.get('/task/:id', (req: any, res: express.Response): void => {
  try {
    logger.info(`req=${req.id} get task by id router`)

    const responseDto: ResponseDto = new TaskController().getTaskById(req.id as string, req?.params?.id as string)
    res.status(responseDto.$status as number).send(responseDto)
  } catch (error) {
    logger.error(`req=${req.id} get task by id router error=${(error as any)?.stack}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
})

router.get('/tasks', (req: any, res: express.Response): void => {
  try {
    logger.info(`req=${req.id} get tasks router`)

    const responseDto: ResponseDto = new TaskController().getTasks(req.id as string, req?.query as { assignedTo?: string, category?: string, offset?: number, limit?: number })
    res.status(responseDto.$status as number).send(responseDto)
  } catch (error) {
    logger.error(`req=${req.id} get tasks router error=${(error as any)?.stack}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
})

export default router
