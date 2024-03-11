import { describe, expect } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { type ValidationResult, type Schema } from 'joi'
import type Task from '../../src/interfaces/task.interface'
import TaskStatus from '../../src/enums/task-status.enum'
import TaskSchema from '../../src/validations/task.validation'
import { http } from '../super-test.config'
import ResponseDto from '../../src/dtos/response.dto'
import HTTPStatus from '../../src/enums/http-status.enum'


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
  it('Test1.1: 1000 fake task against joi schema', (): void => {
    for (let i = 0; i < 1000; ++i) {
      const { error }: ValidationResult<Schema> = TaskSchema.validate(generateTask())
      expect(error).toBeUndefined()
    }
  })
})

describe('Test2: APIs tests', (): void => {
  it('Test2.1: 404 check', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('GET', '/api/data') as any).body)

    expect(responseDto.$status).toBe(HTTPStatus.NOT_FOUND)
    expect(responseDto.$message).toBe('/api/data not found')
  })

  it('Test2.2: Health Check API', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('GET', '/healthcheck') as any).body)

    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toBe('OK')
  })

  
})
