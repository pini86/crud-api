const ERROR_MESSAGES = {
  BODY_INVALID_FORMAT: "Invalid request body format.",
  USER_NOT_FOUND: "User not found.",
  BODY_VALIDATION: "Request body does not contain required fields.",
  RESOURCE_NOT_FOUND: "Requested resource not found.",
  UNEXPECTED_ERROR: "Unexpected error has occured : ",
  USERID_INVALID: "User id is not valid.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
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
