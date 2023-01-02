import * as http from "http";
import { IUser } from "../Interfaces/user";
import { createResponse } from "../Utils/utils";
import { HTTP_CODE } from "../Constants/constants";

const parseRequest = async (
  request: http.IncomingMessage,
  response: http.ServerResponse
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
              { message: "Server side error while parsing request." },
              response
            );
            reject(err);
          }
        })
        .on("error", (err) => reject(err));
    } catch (err) {
      createResponse(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        { message: "Server side error." },
        response
      );
      reject(err);
    }
  });

export { parseRequest };
