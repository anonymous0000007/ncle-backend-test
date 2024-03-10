import request from 'supertest'
import app from '../src/app'
import TestAgent from 'supertest/lib/agent';

/**
 * @type {TestAgent<any>}
 * @description supertest server instance to call APIs
 */
export const supertestInstance: TestAgent<any> = request(app)

/**
 * @returns {any}
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method
 * @param {string} endpoint
 * @param {any} data
 * @description http requests to APIs
 */
export async function http (method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any): Promise<any> {
  let request: any;
  switch (method) {
    case 'GET': {
      request = supertestInstance.get(endpoint)
      break;
    }
    case 'POST': {
      request = supertestInstance.post(endpoint).send(data)
      break;
    }
    case 'PUT': {
      request = supertestInstance.put(endpoint).send(data)
      break;
    }
    case 'DELETE': {
      request = supertestInstance.delete(endpoint)
      break;
    }
  }

  /* json padding escaping characters handling  */
  const response: any = await request.buffer(true).parse((res: any, cb: Function): void => {
    let data: Buffer = Buffer.from('')
    res.on('data', (chunk: any): void => {
      data = Buffer.concat([data, chunk])
    })
    res.on('end', (): void => {
      cb(null, data.toString())
    })
  })

  if (response && response.body) response.body = JSON.parse(response.body.replace(/^\)]}',\n/, ''))

  return response;
}