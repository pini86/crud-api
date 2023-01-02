const ERROR_MESSAGES = {
  USERID_INVALID: "User id is invalid",
  USER_NOT_FOUND: "User not found",
  BODY_INVALID_FORMAT: "Invalid request body format",
  BODY_VALIDATION: "Request body does not contain required fields",
  UNSUPPORTED_OPERATION: "Unsupported operation",
  RESOURCE_NOT_FOUND: "Requested resource doesn't exist",
  UNEXPECTED_ERROR: "Unexpected error has occured, try again later",
};

const HTTP_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export { ERROR_MESSAGES, HTTP_CODE };
