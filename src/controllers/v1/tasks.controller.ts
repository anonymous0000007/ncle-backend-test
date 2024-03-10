import { type Response } from 'express'
import { getLogger, type Logger } from 'log4js'
import { v4 } from 'uuid'
import type Task from '../../interfaces/task.interface'
import HTTPStatus from '../../enums/http-status.enum'
import ResponseDto from '../../dtos/response.dto'
import TaskStatus from '../../enums/task-status.enum'
import ResponseMessage from '../../enums/response-messages.enum'

const logger: Logger = getLogger('task.controller.ts')
logger.level = 'debug'

const tasks: Task[] = []

/**
 * @exports
 * @returns {void}
 * @param {any} req
 * @param {Response} res
 * @description create task API
*/
export function createTask (req: any, res: Response): void {
  try {
    logger.info(`req=${req.id} createTask`)

    /* task uuid, createdAt, updateAt generate for new task, if status not passed by default Pending */
    const task: Task = req.body
    task.id = v4()
    task.createdAt = task.updatedAt = new Date().toString()
    task.status = TaskStatus.PENDING
    tasks.push(task)
    logger.info(`req=${req.id} createTask new taskID=${task.id}`)

    res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, { taskId: task.id }, `${task.id} task created successfully`))
  } catch (error) {
    logger.error(`req=${req.id} createTask error=${JSON.stringify(error)}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
}

/**
 * @exports
 * @returns {void}
 * @param {any} req
 * @param {Response} res
 * @description update task API
 */
export function updateTask (req: any, res: Response): void {
  try {
    logger.info(`req=${req.id} updateTask`)

    /* update task op */
    const updatedTask: Task = req.body
    let isMatched: boolean = false
    for (let task of tasks) {
      if (task.id === req?.params?.id) {
        task = { ...task, ...updatedTask, updatedAt: new Date().toString() }
        isMatched = true
      }
    }

    if (!isMatched) {
      logger.info(`req=${req.id} updateTask ${req?.params?.id} task not found`)
      res.status(HTTPStatus.NOT_FOUND).json(new ResponseDto(HTTPStatus.NOT_FOUND, undefined, `${req?.params?.id} task not found`))
      return
    }

    res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, undefined, `${req?.params?.id} task updated successfully`))
  } catch (error) {
    logger.error(`req=${req.id} updateTask error=${JSON.stringify(error)}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
}

/**
 * @exports
 * @returns {void}
 * @param {any} req
 * @param {Response} res
 * @description delete task API
 */
export function deleteTask (req: any, res: Response): void {
  try {
    logger.info(`req=${req.id} deleteTask`)

    /* update task op */
    let index: number = -1
    for (let i = 0; i < tasks.length; ++i) {
      if (tasks[i]?.id === req?.params?.id) {
        index = i
      }
    }

    if (index === -1) {
      logger.info(`req=${req.id} deleteTask ${req?.params?.id} task not found`)
      res.status(HTTPStatus.NOT_FOUND).json(new ResponseDto(HTTPStatus.NOT_FOUND, undefined, `${req?.params?.id} task not found`))
      return
    }

    tasks.splice(index, 1)

    res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, undefined, `${req?.params?.id} task deleted successfully`))
  } catch (error) {
    logger.error(`req=${req.id} deleteTask error=${JSON.stringify(error)}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
}

/**
 * @exports
 * @returns {void}
 * @param {any} req
 * @param {Response} res
 * @description get task by id
 */
export function getTaskById (req: any, res: Response): void {
  try {
    logger.info(`req=${req.id} getTaskById`)

    let index: number = -1
    for (let i = 0; i < tasks.length; ++i) {
      if (tasks[i]?.id === req?.params?.id) {
        index = i
      }
    }

    if (index === -1) {
      logger.info(`req=${req.id} getTaskById ${req?.params?.id} task not found`)
      res.status(HTTPStatus.NOT_FOUND).json(new ResponseDto(HTTPStatus.NOT_FOUND, undefined, `${req?.params?.id} task not found`))
      return
    }

    res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, tasks[index], `${req?.params?.id} task retreived successfully`))
  } catch (error) {
    logger.error(`req=${req.id} getTaskById error=${JSON.stringify(error)}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
}

/**
 * @exports
 * @returns {void}
 * @param {any} req
 * @param {Response} res
 * @description get tasks
 */
export function getTasks (req: any, res: Response): void {
  try {
    logger.info(`req=${req.id} getTasks queryParams=${JSON.stringify(req?.query)}`)

    let filteredTasks: Task[]

    /* query assignedTo, category filter */
    const assignedTo: string | undefined = req?.query?.assignedTo
    const category: string | undefined = req?.query?.category

    let filterFunction: ((task: Task) => boolean) | undefined
    if (
      (typeof assignedTo === 'string' && assignedTo !== '') &&
      (typeof category === 'string' && category !== '')
    ) {
      filterFunction = (task: Task): boolean => assignedTo === task.assignedTo && category === task.category
    } else if ((typeof assignedTo === 'string' && assignedTo !== '')) {
      filterFunction = (task: Task): boolean => assignedTo === task.assignedTo
    } else if ((typeof category === 'string' && category !== '')) {
      filterFunction = (task: Task): boolean => category === task.category
    }

    if (filterFunction !== undefined) {
      filteredTasks = tasks.filter(filterFunction)
      res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, filteredTasks, `${filteredTasks.length} tasks retrieved successfully`))
      return
    }

    /* pagination */
    // const offset: number = Number(req?.query?.offset)
    // const limit: number = Number(req?.query?.limit)

    // console.log(offset)
    // console.log(limit)

    res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, tasks, `${tasks.length} tasks retrieved successfully`))
  } catch (error) {
    logger.error(`req=${req.id} getTasks error=${JSON.stringify(error)}`)
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(new ResponseDto(HTTPStatus.INTERNAL_SERVER_ERROR, undefined, ResponseMessage.INTERNAL_SERVER_ERROR))
  }
}
