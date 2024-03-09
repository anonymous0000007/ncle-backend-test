import { createServer } from 'http'
import { type Logger, getLogger } from 'log4js'
import app from './app'

/* server logging setup */
const logger: Logger = getLogger('server.ts')
logger.level = 'debug'

/* server setup with express app */
const server = createServer(app)
server.listen(process.env?.['PORT'], (): void => {
  logger.info(`Server is running on port ${process.env?.['PORT']}`)
})

/* server cleanup process on unexpeceted termination */
process.on('exit', (signal: number): void => {
  logger.warn(`${signal} signal received shutting down server...`)
  logger.info('Cleanup process started...')
  logger.info('Cleanup process completed...')
  logger.fatal('Server shutdown')
})
process.on('SIGINT', (): void => process.exit())
process.on('SIGTERM', (): void => process.exit())
