import { getLogger, type Logger } from 'log4js'
import { v4 } from 'uuid'
import type Task from '../../interfaces/task.interface'
import HTTPStatus from '../../enums/http-status.enum'
import ResponseDto from '../../dtos/response.dto'
import TaskStatus from '../../enums/task-status.enum'

const logger: Logger = getLogger('task.controller.ts')
logger.level = 'debug'

/**
 * @class TaskController
 * @description task controller class to make it testable structure
 */
export default class TaskController {
  private static readonly tasks: Task[] = []

  /**
   * @public
   * @exports
   * @returns {ResponseDto}
   * @param {string} reqId
   * @param {Task} task
   * @description create task
  */
  public createTask (reqId: string, task: Task): ResponseDto {
    logger.info(`req=${reqId} createTask`)

    /* task uuid, createdAt, updateAt generate for new task, if status not passed by default Pending */
    task.id = v4()
    task.createdAt = task.updatedAt = new Date().toString()
    task.status = TaskStatus.PENDING
    TaskController.tasks.push(task)
    logger.info(`req=${reqId} createTask new taskID=${task.id}`)

    return new ResponseDto(HTTPStatus.OK, { taskId: task.id }, `${task.id} task created successfully`)
  }

  /**
   * @public
   * @exports
   * @returns {ResponseDto}
   * @param {string} reqId
   * @param {string} taskId
   * @param {Task} updateObj
   * @description update task
   */
  public updateTask (reqId: string, taskId: string, updateObj: Task): ResponseDto {
    logger.info(`req=${reqId} updateTask`)

    /* update task op */
    let isMatched: boolean = false
    for (let i = 0; i < TaskController.tasks.length; ++i) {
      if (TaskController.tasks[i]?.id === taskId) {
        TaskController.tasks[i] = { ...TaskController.tasks[i], ...updateObj, updatedAt: new Date().toString() }
        isMatched = true
      }
    }

    if (!isMatched) {
      logger.info(`req=${reqId} updateTask ${taskId} task not found`)
      return new ResponseDto(HTTPStatus.NO_CONTENT, undefined, `${taskId} task not found`)
    }

    return new ResponseDto(HTTPStatus.OK, undefined, `${taskId} task updated successfully`)
  }

  /**
   * @public
   * @exports
   * @returns {ResponseDto}
   * @param {string} reqId
   * @param {string} taskId
   * @description delete task
   */
  public deleteTask (reqId: string, taskId: string): ResponseDto {
    logger.info(`req=${reqId} deleteTask`)

    /* update task op */
    let index: number = -1
    for (let i = 0; i < TaskController.tasks.length; ++i) {
      if (TaskController.tasks[i]?.id === taskId) {
        index = i
      }
    }

    if (index === -1) {
      logger.info(`req=${reqId} deleteTask ${taskId} task not found`)
      return new ResponseDto(HTTPStatus.NO_CONTENT, undefined, `${taskId} task not found`)
    }

    TaskController.tasks.splice(index, 1)

    return new ResponseDto(HTTPStatus.OK, undefined, `${taskId} task deleted successfully`)
  }

  /**
   * @public
   * @exports
   * @returns {ResponseDto}
   * @param {string} reqId
   * @param {string} taskId
   * @description get task by id
   */
  public getTaskById (reqId: string, taskId: string): ResponseDto {
    logger.info(`req=${reqId} getTaskById`)

    let index: number = -1
    for (let i = 0; i < TaskController.tasks.length; ++i) {
      if (TaskController.tasks[i]?.id === taskId) {
        index = i
      }
    }

    if (index === -1) {
      logger.info(`req=${reqId} getTaskById ${taskId} task not found`)
      return new ResponseDto(HTTPStatus.NO_CONTENT, undefined, `${taskId} task not found`)
    }

    return new ResponseDto(HTTPStatus.OK, TaskController.tasks[index], `${taskId} task retreived successfully`)
  }

  /**
   * @public
   * @exports
   * @returns {ResponseDto}
   * @param {string} reqId
   * @param {{ assignedTo?: string, category?: string, offset?: number, limit?: number }} [queryParams={}]
   * @param {string} [queryParams.assignedTo] - task assignedTo for filter
   * @param {string} [queryParams.category] - task category for filter
   * @param {number} [queryParams.offset] - pagination offset
   * @param {number} [queryParams.limit] - pagination limit
   * @description get tasks by (assingedTo | category | assignedTo & category | all) + pagination
   */
  public getTasks (reqId: string, { assignedTo, category, offset, limit }: { assignedTo?: string, category?: string, offset?: number, limit?: number } = {}): ResponseDto {
    logger.info(`req=${reqId} getTasks assignedTo=${assignedTo} category=${category} offset=${offset} limit=${limit}`)

    let filteredTasks: Task[] = TaskController.tasks

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

    if (filterFunction !== undefined) filteredTasks = TaskController.tasks.filter(filterFunction)

    /* pagination */
    if (offset !== undefined && limit !== undefined) {
      const remainingLimit: number = filteredTasks.length - offset
      filteredTasks = filteredTasks.splice(offset, limit < remainingLimit ? limit : remainingLimit)
    }

    return new ResponseDto(HTTPStatus.OK, filteredTasks, `${filteredTasks.length} tasks retrieved successfully`)
  }
}
