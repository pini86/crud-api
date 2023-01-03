import { ServerResponse } from "http";
import { HTTP_CODE } from "../Constants/constants";

function createResponse(
  status: number,
  message: object | string,
  response: ServerResponse
) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(message));
}

function notFoundResponse(info: string, response: ServerResponse) {
  createResponse(
    HTTP_CODE.NOT_FOUND,
    { message: `${info} was not found.` },
    response
  );
}

export { createResponse, notFoundResponse };
