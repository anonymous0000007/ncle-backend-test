import type Status from '../enums/task-status.enum'

/**
 * @interface Task
 * @description task interface
 */
export default interface Task {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  dueDate: string
  assignedTo: string
  category: string
  status: Status
}
