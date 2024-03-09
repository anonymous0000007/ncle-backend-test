import type HTTPStatus from '../enums/http-status.enum'

/**
 * @class ResponseDto
 * @description custom response dto
 */
export default class ResponseDto {
  private body: any
  private error: string | undefined
  private message: string | undefined
  private metadata: any
  private status: HTTPStatus | undefined

  /**
    * @constructor
    * @param {HTTPStatus} [status]
    * @param {any} [body]
    * @param {string | undefined} [message]
    * @param {string | undefined} [error]
    * @param {any} [metadata]
    */
  constructor (
    status?: HTTPStatus,
    body?: any,
    message?: string | undefined,
    error?: string | undefined,
    metadata?: any
  ) {
    this.body = body
    this.error = error
    this.message = message
    this.metadata = metadata
    this.status = status
  }

  /**
    * @public
    * @return {void}
    * @param {HTTPStatus | undefined} [status]
    * @param {any} [body]
    * @param {string | undefined} [message]
    * @param {string | undefined} [error]
    * @param {any} [metadata]
    * @param {boolean} [override = false]
    * @description set all/partial values
    */
  public setValues (
    status?: HTTPStatus | undefined,
    body?: any,
    message?: string | undefined,
    error?: string | undefined,
    metadata?: any,
    override: boolean = false
  ): void {
    if (override) {
      this.body = body
      this.error = error
      this.message = message
      this.metadata = metadata
      this.status = status
      return
    }

    if (body !== undefined) this.body = body
    if (error !== undefined) this.error = error
    if (message !== undefined) this.message = message
    if (metadata !== undefined) this.metadata = metadata
    if (status !== undefined) this.status = status
  }

  /**
    * @public
    * @return {void}
    * @param {Object} response
    * @param {HTTPStatus | undefined} [response.status]
    * @param {any} [response.body]
    * @param {string | undefined} [response.message]
    * @param {string | undefined} [response.error]
    * @param {any} [response.metadata]
    * @param {boolean} [override = false]
    * @description set all/partial values
    */
  public setObjValues (
    { status, body, message, error, metadata }: any,
    override: boolean = false
  ): void {
    if (override) {
      this.body = body
      this.error = error
      this.message = message
      this.metadata = metadata
      this.status = status
      return
    }

    if (body !== undefined) this.body = body
    if (error !== undefined) this.error = error
    if (message !== undefined) this.message = message
    if (metadata !== undefined) this.metadata = metadata
    if (status !== undefined) this.status = status
  }

  /**
    * @public
    * @getter body
    * @return {any}
    */
  public get $body (): any {
    return this.body
  }

  /**
    * @public
    * @setter body
    * @param {any} body
    */
  public set $body (body: any) {
    this.body = body
  }

  /**
    * @public
    * @getter message
    * @return {string | undefined}
    */
  public get $message (): string | undefined {
    return this.message
  }

  /**
    * @public
    * @setter message
    * @param {string | undefined} message
    */
  public set $message (message: string | undefined) {
    this.message = message
  }

  /**
    * @public
    * @getter error
    * @return {string | undefined}
    */
  public get $error (): string | undefined {
    return this.error
  }

  /**
    * @public
    * @setter error
    * @param {string | undefined} error
    */
  public set $error (error: string | undefined) {
    this.error = error
  }

  /**
    * @public
    * @getter metadata
    * @return {any}
    */
  public get $metadata (): any {
    return this.metadata
  }

  /**
    * @public
    * @setter metadata
    * @param {any} metadata
    */
  public set $metadata (metadata: any) {
    this.metadata = metadata
  }

  /**
    * @public
    * @getter status
    * @return {HTTPStatus | undefined}
    */
  public get $status (): HTTPStatus | undefined {
    return this.status
  }

  /**
    * @public
    * @setter status
    * @param {HTTPStatus | undefined} status
    */
  public set $status (status: HTTPStatus | undefined) {
    this.status = status
  }
}
