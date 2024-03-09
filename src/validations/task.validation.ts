import Joi, { type Schema } from 'joi'
import Status from '../enums/task-status.enum'

/**
 * @exports
 * @description joi task validation schema
 */
const TaskSchema: Schema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(3).max(1000).required(),
  dueDate: Joi.string().required(),
  assignedTo: Joi.string().required(),
  category: Joi.string().required(),
  status: Joi.string().valid(...Object.values(Status))
})

export default TaskSchema
