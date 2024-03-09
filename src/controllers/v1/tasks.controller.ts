import { type Response } from 'express'
import { getLogger, type Logger } from 'log4js'
import { v4 } from 'uuid'
import type Task from '../../interfaces/task.interface'
import HTTPStatus from '../../enums/http-status.enum'
import ResponseDto from '../../dtos/response.dto'
import TaskStatus from '../../enums/task-status.enum'

const logger: Logger = getLogger('task.controller.ts')
logger.level = 'debug'

const tasks: Task[] = []

/**
 * @exports
 * @param {any} req
 * @param {Response} res
 * @description create task
*/
export function createTask (req: any, res: Response): void {
  logger.info(`req=${req.id} createTask`)

  /* task uuid, createdAt, updateAt generate for new task, if status not passed by default Pending */
  const task: Task = req.body
  task.id = v4()
  task.createdAt = task.updatedAt = new Date().toString()
  task.status = task.status ?? TaskStatus.PENDING
  tasks.push(task)
  logger.info(`req=${req.id} createTask new taskID=${task.id}`)

  res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, { taskId: task.id }, 'Task created successfully'))
}

/**
 * @exports
 * @param {any} req
 * @param {Response} res
 * @description update task
 */
export function updateTask (req: any, res: Response): void {
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
    res.status(HTTPStatus.NOT_FOUND).json(new ResponseDto(HTTPStatus.OK, undefined, `${req?.params?.id} task not found`))
    return
  }

  res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, undefined, 'Task updated successfully'))
}

export function deleteTask (): void {

}

export function getTaskById (): void {

}

export function getTasks (): void {

}
