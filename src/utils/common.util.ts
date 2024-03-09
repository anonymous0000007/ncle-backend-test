import { type Response, type NextFunction } from 'express'
import { getLogger, type Logger } from 'log4js'
import { type ValidationResult, type Schema } from 'joi'
import HTTPStatus from '../enums/http-status.enum'
import ResponseDto from '../dtos/response.dto'

const logger: Logger = getLogger('common.util.ts')
logger.level = 'debug'

/**
 * @class CommonUtil
 * @description common utility functions
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CommonUtil {
  /**
   * @returns {Function}
   * @param {Schema} schema
   * @description validate joi schema wrapper function
   */
  public static validateSchema (schema: Schema): (req: any, res: Response, next: NextFunction) => void {
    /**
     * @returns {void}
     * @param {any} req
     * @param {Response} res
     * @description validate joi schema middleware function
     */
    return (req: any, res: Response, next: NextFunction): void => {
      logger.info(`req=${req.id} validateSchema`)

      const { error }: ValidationResult<Schema> = schema.validate(req.body)
      logger.info(`req=${req.id} validateSchema error=${JSON.stringify(error)}}`)

      if (error !== undefined) {
        const errorMessage: string = error?.details[0]?.message ?? ''
        res.status(HTTPStatus.BAD_REQUEST).json(new ResponseDto(HTTPStatus.BAD_REQUEST, undefined, errorMessage))
      }

      next()
    }
  }
}
