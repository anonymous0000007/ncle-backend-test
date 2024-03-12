import { describe, expect } from '@jest/globals'
import { faker } from '@faker-js/faker'
import type Task from '../../src/interfaces/task.interface'
import HTTPStatus from '../../src/enums/http-status.enum'
import TaskStatus from '../../src/enums/task-status.enum'
import ResponseDto from '../../src/dtos/response.dto'
import { http } from '../super-test.config'

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


let tasks: Task[] = [];

describe('Test1: Task Management App e2e Tests', (): void => {

  test('Test1.1: should create a new task', async (): Promise<void> => {
    const response: any = new ResponseDto()
    response.setObjValues((await http('POST', '/api/v1/task', generateTask())).body)
    expect(response.$status).toBe(HTTPStatus.OK)
    /* update the in-memory array with the created task */
    tasks.push(response.$body)
  });

  test('Test1.2: should update the task', async (): Promise<void> => {
    const task: Task = generateTask();
    const response: ResponseDto = new ResponseDto()
    response.setObjValues((await http('PUT', `/api/v1/task/${tasks[0]?.id}`, task)).body)
    expect(response.$status).toBe(HTTPStatus.OK)
    expect(response.$body.title).toBe(task.title)
    expect(response.$body.description).toBe(task.description)
    expect(response.$body.dueDate).toBe(task.dueDate)
    expect(response.$body.assignedTo).toBe(task.assignedTo)
    expect(response.$body.category).toBe(task.category)
    expect(response.$body.status).toBe(task.status)
    tasks[0] = response.$body
  });

  test('Test1.3: should get the task', async (): Promise<void> => {
    const response: ResponseDto = new ResponseDto()
    response.setObjValues((await http('GET', `/api/v1/task/${tasks[0]?.id}`)).body)
    expect(response.$status).toBe(HTTPStatus.OK)
    expect(response.$body.title).toBe(tasks[0]?.title)
    expect(response.$body.description).toBe(tasks[0]?.description)
    expect(response.$body.dueDate).toBe(tasks[0]?.dueDate)
    expect(response.$body.assignedTo).toBe(tasks[0]?.assignedTo)
    expect(response.$body.category).toBe(tasks[0]?.category)
    expect(response.$body.status).toBe(tasks[0]?.status)
  });

  test('Test1.4: should delete the task', async (): Promise<void> => {
    const response: ResponseDto = new ResponseDto()
    response.setObjValues((await http('DELETE', `/api/v1/task/${tasks[0]?.id}`)).body)
    expect(response.$status).toBe(HTTPStatus.OK)
  });

  test('Test1.5: should get tasks', async (): Promise<void> => {
    const response: ResponseDto = new ResponseDto()
    response.setObjValues((await http('GET', '/api/v1/tasks')).body)
    expect(response.$status).toBe(HTTPStatus.OK);
    console.log(JSON.stringify(response.$body))
    expect(response.$body.length).toBe(0);
  });

})
