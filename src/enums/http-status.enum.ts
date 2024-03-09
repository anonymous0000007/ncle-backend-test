/**
 * @exports
 * @enum {number}
 * @description http status codes
 */
enum HTTPStatus {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401, /* no credential or invalid credential */
  FORBIDDEN = 403, /* valid credential but not enough privileges */
  NOT_FOUND = 404,
  TIMEOUT = 408,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  EXPIRED = 498,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

export default HTTPStatus
