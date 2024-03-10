import { describe, expect, test } from '@jest/globals'
// import supertest from 'supertest'
import { faker } from '@faker-js/faker'
import { type ValidationResult, type Schema } from 'joi'
// import app from '../../src/app'
import type Task from '../../src/interfaces/task.interface'
import TaskStatus from '../../src/enums/task-status.enum'
import TaskSchema from '../../src/validations/task.validation'

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

describe('Joi TaskSchema Validation', () => {
  test('Test 1000 fake task against joi schema', () => {
    for (let i = 0; i < 1000; ++i) {
      const { error }: ValidationResult<Schema> = TaskSchema.validate(generateTask)
      expect(error).toBeUndefined()
    }
  })
})
