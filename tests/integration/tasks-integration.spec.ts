import { faker } from "@faker-js/faker"
import ResponseDto from "../../src/dtos/response.dto"
import type HTTPStatus from "../../src/enums/http-status.enum"
import { http } from "../super-test.config"
import type Task from "../../src/interfaces/task.interface"

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

  it('Test2.3: Create Task', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('POST', '/api/v1/task', generateTask()) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain('task created successfully')

    responseDto.setObjValues((await http('POST', '/api/v1/task') as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.BAD_REQUEST)
  })

  it('Test2.4: Update Task', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('POST', '/api/v1/task', generateTask()) as any).body)

    responseDto.setObjValues((await http('PUT', `/api/v1/task/${responseDto?.$body?.taskId}`, generateTask()) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain('task updated successfully')

    responseDto.setObjValues((await http('PUT', '/api/v1/task/sdsd') as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.BAD_REQUEST)

    const response: any = await http('PUT', '/api/v1/task/sdsd', generateTask())
    expect(response.status).toBe(HTTPStatus.NO_CONTENT)
  })

  it('Test2.5: Delete Task', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('POST', '/api/v1/task', generateTask()) as any).body)

    responseDto.setObjValues((await http('DELETE', `/api/v1/task/${responseDto?.$body?.taskId}`) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain('task deleted successfully')

    const response: any = await http('DELETE', '/api/v1/task/sdsd')
    expect(response.status).toBe(HTTPStatus.NO_CONTENT)
  })

  it('Test2.6: Get Task By ID', async (): Promise<void> => {
    const responseDto: ResponseDto = new ResponseDto()
    responseDto.setObjValues((await http('POST', '/api/v1/task', generateTask()) as any).body)

    responseDto.setObjValues((await http('GET', `/api/v1/task/${responseDto?.$body?.taskId}`, generateTask()) as any).body)
    expect(responseDto.$status).toBe(HTTPStatus.OK)
    expect(responseDto.$message).toContain('task retreived successfully')

    const response: any = await http('GET', '/api/v1/task/sdsd', generateTask())
    expect(response.status).toBe(HTTPStatus.NO_CONTENT)
  })

  it('Test2.7: Get Tasks', (): void => {

    test('Test2.7.1: Get Task By assignedTo & category query params combination', async (): Promise<void> => {
      let assignedTo: string = '',
          category: string = '';
      for (let i = 0; i < 5; ++i) {
        const task: Task = generateTask()
        assignedTo = task.assignedTo
        category = task.category
        await http('POST', '/api/v1/task', task)
      }

      const responseDto = new ResponseDto();
      responseDto.setObjValues((await http('GET', `/api/v1/tasks?assignedTo=${assignedTo}`) as any).body)
      expect(responseDto.$body).
    })

    test('', async (): Promise<void> => {

    })

    test('', async (): Promise<void> => {

    })
  })
})
