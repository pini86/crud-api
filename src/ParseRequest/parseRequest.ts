import { IncomingMessage, ServerResponse } from "http";
import { IUser } from "../Interfaces/user";
import { createResponse } from "../Utils/utils";
import { HTTP_CODE, ERROR_MESSAGES } from "../Constants/constants";

const parseRequest = async (
  request: IncomingMessage,
  response: ServerResponse
): Promise<IUser> =>
  new Promise((resolve, reject) => {
    try {
      let content = "";

      request
        .setEncoding("utf8")
        .on("data", (chunk) => (content += chunk))
        .on("end", () => {
          try {
            resolve(JSON.parse(content));
          } catch (err) {
            createResponse(
              HTTP_CODE.INTERNAL_SERVER_ERROR,
              { message: ERROR_MESSAGES.BODY_INVALID_FORMAT },
              response
            );
            reject(err);
          }
        })
        .on("error", (err) => reject(err));
    } catch (err) {
      createResponse(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        { message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
        response
      );
      reject(err);
    }
  });

export { parseRequest };
