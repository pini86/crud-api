import { ServerResponse } from "http";
import { HTTP_CODE } from "../Constants/constants";
import { IUser } from "../Interfaces/user";

function createResponse(
  status: number,
  message: object | string,
  response: ServerResponse
) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(message));
}

function notFoundResponse(info: string, response: ServerResponse) {
  createResponse(HTTP_CODE.NOT_FOUND, `${info} was not found.`, response);
}

function checkUser(checkdeUser: IUser): boolean {
  try {
    let { username, age, hobbies } = checkdeUser;
    username = username.trim();
    if (
      !username ||
      !age ||
      !hobbies ||
      typeof age !== "number" ||
      typeof username !== "string" ||
      !Array.isArray(hobbies) ||
      (hobbies.length !== 0 && hobbies.some((item) => typeof item !== "string"))
    )
      return false;
    return true;
  } catch (err) {
    return false;
  }
}

export { createResponse, notFoundResponse, checkUser };
