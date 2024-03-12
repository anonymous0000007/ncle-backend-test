import { describe, expect } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { type ValidationResult, type Schema } from 'joi'
import type Task from '../../src/interfaces/task.interface'
import HTTPStatus from '../../src/enums/http-status.enum'
import TaskStatus from '../../src/enums/task-status.enum'
import TaskSchema from '../../src/validations/task.validation'
import ResponseDto from '../../src/dtos/response.dto'
import TaskController from '../../src/controllers/v1/tasks.controller'


/**
 * @returns {Task}
 * @description generate task fake data
 */
function generateTask (): Task {
  return {
    title: faker.lorem.words(),
    description: faker.lorem.sentence(),
    dueDate: faker.date.future().toISOString(),
    assignedTo: faker.internet.email(),
    category: faker.lorem.word(),
    status: faker.helpers.arrayElement(Object.values(TaskStatus))
  }
}

describe('Test1: Joi TaskSchema Validation Test', (): void => {
  it('Test1.1: 100 fake task against joi schema', (): void => {
    for (let i = 0; i < 100; ++i) {
      const { error }: ValidationResult<Schema> = TaskSchema.validate(generateTask())
      expect(error).toBeUndefined()
    }
  })
})

describe('Test2: tasks controller functions tests', (): void => {
  const tasks: Task[] = [];

  test('Test2.1: createTask() 100 fake task', (): void => {
    for (let i = 0; i < 100; ++i) {
      const responseDto: ResponseDto = new TaskController().createTask('test', generateTask())
      expect(responseDto.$status).toBe(HTTPStatus.OK)
      expect(responseDto.$body).toBeDefined()
      expect(responseDto.$body?.id).toBeDefined()
      expect(responseDto.$message).toContain('task created successfully')
      tasks.push(responseDto.$body)
    }
  })

  test('Test2.2: updateTask() 50 fake task', (): void => {
    let responseDto: ResponseDto;

    for (let i = 0; i < 50; ++i) {
      responseDto = new TaskController().updateTask('test', tasks[i]?.id as string, generateTask())
      expect(responseDto.$status).toBe(HTTPStatus.OK)
      expect(responseDto.$body).toBeDefined()
      expect(responseDto.$message).toContain('task updated successfully')
    }
  })

  test('Test2.3: deleteTask() 10 fake task', (): void => {
    let responseDto: ResponseDto;
    responseDto = new TaskController().deleteTask('test', undefined as any)
    expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
    expect(responseDto.$message).toContain('task not found')

    responseDto = new TaskController().deleteTask('test', '')
    expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
    expect(responseDto.$message).toContain('task not found')

    responseDto = new TaskController().deleteTask('test', null as any)
    expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
    expect(responseDto.$message).toContain('task not found')

    for (let i = 10; i < 20; ++i) {
      responseDto = new TaskController().deleteTask('test', tasks[i]?.id as string)
      expect(responseDto.$status).toBe(HTTPStatus.OK)
      expect(responseDto.$body).toBeUndefined()
      expect(responseDto.$message).toContain('task deleted successfully')
    }

    for (let i = 10; i < 20; ++i) {
      responseDto = new TaskController().deleteTask('test', tasks[i]?.id as string)
      expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
      expect(responseDto.$body).toBeUndefined()
      expect(responseDto.$message).toContain('task not found')
    }
  })

  test('Test2.4: getTaskById() 10 task', (): void => {
    let responseDto: ResponseDto;
    responseDto = new TaskController().getTaskById('test', undefined as any)
    expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
    expect(responseDto.$message).toContain('task not found')

    responseDto = new TaskController().getTaskById('test', '')
    expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
    expect(responseDto.$message).toContain('task not found')

    responseDto = new TaskController().getTaskById('test', null as any)
    expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
    expect(responseDto.$message).toContain('task not found')

    responseDto = new TaskController().getTaskById('test', tasks[10]?.id as string)
    expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
    expect(responseDto.$message).toContain('task not found')

    for (let i = 10; i < 20; ++i) {
      responseDto = new TaskController().getTaskById('test', tasks[i]?.id as string)
      expect(responseDto.$status).toBe(HTTPStatus.NO_CONTENT)
      expect(responseDto.$body).toBeUndefined()
      expect(responseDto.$message).toContain('task not found')
    }

    for (let i = 21; i < 30; ++i) {
      responseDto = new TaskController().getTaskById('test', tasks[i]?.id as string)
      expect(responseDto.$status).toBe(HTTPStatus.OK)
      expect(responseDto.$body).toBeDefined()
      expect(responseDto.$message).toContain('task retreived successfully')
    }
  })

  test('Test2.5: getTasks() 10 fake task', (): void => {
    let responseDto: ResponseDto;
    responseDto = new TaskController().getTasks('test')
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    /* 10 tasks deleted that is why 90 */
    expect(responseDto.$message).toBe(`90 tasks retrieved successfully`)

    responseDto = new TaskController().getTasks('test', { offset: 10, limit: 20 })
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toBe(`${20} tasks retrieved successfully`)

    responseDto = new TaskController().getTasks('test', { assignedTo: tasks[51]?.assignedTo as string })
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain(`tasks retrieved successfully`)

    responseDto = new TaskController().getTasks('test', { category: tasks[51]?.category as string })
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain(`tasks retrieved successfully`)

    responseDto = new TaskController().getTasks('test', { assignedTo: tasks[52]?.assignedTo as string, category: tasks[52]?.category as string })
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain(`tasks retrieved successfully`)
  })
})
