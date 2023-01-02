import * as http from "http";

function createResponse(
  status: number,
  message: object | string,
  response: http.ServerResponse
) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(message));
}

function notFoundResponse(info: string, response: http.ServerResponse) {
  createResponse(404, { message: `${info} was not found.` }, response);
}

export { createResponse, notFoundResponse };
