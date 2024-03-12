import { faker } from "@faker-js/faker"
import { http } from "../super-test.config"
import type Task from "../../src/interfaces/task.interface"
import ResponseDto from "../../src/dtos/response.dto"
import HTTPStatus from "../../src/enums/http-status.enum"
import TaskStatus from "../../src/enums/task-status.enum"

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

describe('Test1: APIs tests', (): void => {

  test('Test1.1: 404 check', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('GET', '/api/data') as any).body)

    expect(responseDto.$status).toBe(HTTPStatus.NOT_FOUND)
    expect(responseDto.$message).toBe('/api/data not found')
  })

  test('Test1.2: Health Check API', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('GET', '/healthcheck') as any).body)

    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toBe('OK')
  })

  test('Test1.3: Create Task', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('POST', '/api/v1/task', generateTask()) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain('task created successfully')

    responseDto.setObjValues((await http('POST', '/api/v1/task') as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.BAD_REQUEST)
  })

  test('Test1.4: Update Task', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('POST', '/api/v1/task', generateTask()) as any).body)

    responseDto.setObjValues((await http('PUT', `/api/v1/task/${responseDto?.$body?.id}`, generateTask()) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain('task updated successfully')

    responseDto.setObjValues((await http('PUT', '/api/v1/task/sdsd') as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.BAD_REQUEST)

    const response: any = await http('PUT', '/api/v1/task/sdsd', generateTask())
    expect(response.status).toBe(HTTPStatus.NO_CONTENT)
  })

  test('Test1.5: Delete Task', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('POST', '/api/v1/task', generateTask()) as any).body)

    responseDto.setObjValues((await http('DELETE', `/api/v1/task/${responseDto?.$body?.id}`) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain('task deleted successfully')

    const response: any = await http('DELETE', '/api/v1/task/sdsd')
    expect(response.status).toBe(HTTPStatus.NO_CONTENT)
  })

  test('Test1.6: Get Task By ID', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('POST', '/api/v1/task', generateTask()) as any).body)

    responseDto.setObjValues((await http('GET', `/api/v1/task/${responseDto?.$body?.id}`, generateTask()) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain('task retreived successfully')

    const response: any = await http('GET', '/api/v1/task/sdsd', generateTask())
    expect(response.status).toBe(HTTPStatus.NO_CONTENT)
  })

  test('Test2.7: Get Tasks', async (): Promise<void> => {
    const responseDto = new ResponseDto();
    responseDto.setObjValues((await http('GET', `/api/v1/tasks`) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$body).toBeDefined()
  })
})
