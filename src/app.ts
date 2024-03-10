import path from 'path'
import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { type Logger, getLogger, connectLogger } from 'log4js'
import helmet from 'helmet'
import compression from 'compression'
import { v4 } from 'uuid'
import HTTPStatus from './enums/http-status.enum'
import ResponseDto from './dtos/response.dto'
import v1TaskRouters from './routers/v1/tasks.router'
import ResponseMessage from './enums/response-messages.enum'

const logger: Logger = getLogger('app.ts')
logger.level = 'debug'

/* .env setup */
config({ path: path.resolve(path.join(__dirname, '/../.env')) })

const app = express()

/* request json body configuration */
app.use(express.json({ limit: process.env?.['REQ_BODY_LIMIT'] }))

/* url query params configuration */
app.use(express.urlencoded({
  extended: false,
  parameterLimit: Number(process.env?.['REQ_PARAM_LIMIT'])
}))

/* compress each & every request */
app.use(compression({
  filter: (req: express.Request, res: express.Response): boolean => {
    if (req?.headers['x-no-compression'] === 'true') return false
    return compression.filter(req, res)
  }
}))

/* logging - every & every request */
app.use(connectLogger(logger, {
  level: 'auto',
  format: (req: any, _: express.Response, format: (str: string) => string): string => {
    const requestBody: string = JSON.stringify(req.body)
    return format(`RequestId=${req.id} IP=:remote-addr - ":method :url HTTP/:http-version" Status=:status Content-Length=:content-length Host=":referrer" User-Agent=":user-agent" ${requestBody === '{}' ? '' : 'Request-Body=' + requestBody}`)
  }
}))

/* security related stuff */
/* allowed cross origins configuration */
app.use(cors({
  origin: process.env?.['WHITE_LISTED_DOMAINS']?.split(','),
  methods: 'GET, POST, PUT, DELETE',
  credentials: true
}))

/* security headers library */
app.use(helmet())

/* XSSI/jsonp vulnerability */
app.use((_: express.Request, res: express.Response, next: express.NextFunction): void => {
  res.json = function (json: any): express.Response<any, Record<string, any>> {
    res.setHeader('Content-Type', 'application/json')
    return res.send(`)]}',\n${JSON.stringify(json)}`)
  }
  next()
})

/* common middleware */
app.use((req: any, res: express.Response, next: express.NextFunction): void => {
  req.id = v4()

  /* request timeout */
  res.setTimeout(Number(process.env?.['API_TIMEOUT_MS']), (): void => {
    res.status(HTTPStatus.TIMEOUT).json(
      new ResponseDto(HTTPStatus.TIMEOUT, undefined, ResponseMessage.TIMEOUT)
    )
  })

  next()
})

/* APIs routers */
app.use('/api/v1', v1TaskRouters)
app.get('/healthcheck', (_: express.Request, res: express.Response): void => {
  res.status(HTTPStatus.OK).json(new ResponseDto(HTTPStatus.OK, undefined, 'OK'))
})
/* wildcard route protection */
app.use('*', ({ originalUrl }: express.Request, res: express.Response): void => {
  res.status(HTTPStatus.NOT_FOUND).json(new ResponseDto(HTTPStatus.NOT_FOUND, undefined, `${originalUrl} not found`))
})

export default app
