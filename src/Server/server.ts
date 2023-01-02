import * as path from "path";
import * as http from "http";
import * as dotenv from "dotenv";
import { createResponse, notFoundResponse } from "../Utils/utils";
import { validate } from "uuid";
import {
  getAllUsers,
  createUser,
  getUserById,
  deleteUserById,
  updateUserById,
} from "../Controller/controllerUser";
import { HTTP_CODE } from "../Constants/constants";

const PATH_ENV = path.resolve(process.cwd(), ".env");
dotenv.config({ path: PATH_ENV });

process.on("unhandledRejection", (err) => console.log(err));
process.on("uncaughtException", (err) => console.log(err));

const PORT: number | string = process.env.PORT ?? 4000;

const server = http
  .createServer({ insecureHTTPParser: true }, (request, response) => {
    try {
      if (!request.url) return notFoundResponse(request.url ?? "", response);

      if (request.url == "/api/users") {
        if (request.method == "GET") return getAllUsers(request, response);
        if (request.method == "POST") return createUser(request, response);
      }

      if (request.url.startsWith("/api/users/")) {
        const uuid = request.url.split("/").slice(3).join("/");
        if (!validate(uuid))
          return createResponse(
            HTTP_CODE.BAD_REQUEST,
            `${uuid} is not a valid uuid`,
            response
          );

        if (request.method == "DELETE")
          return deleteUserById(request, response, uuid);
        if (request.method == "PUT")
          return updateUserById(request, response, uuid);
        if (request.method == "GET")
          return getUserById(request, response, uuid);
      }
      return notFoundResponse(request.url ?? "", response);
    } catch (err) {
      createResponse(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        { message: "Server error" },
        response
      );
    }
  })
  .on("error", (err) => {
    console.log(`unhandled exception, error: ${JSON.stringify(err)}`);
  })
  .on("clientError", (err, socket) => {
    socket.end("HTTP/1.1 500 internal server error\r\n\r\n");
  });

export { server };

server
  .listen(PORT)
  .on("listening", () => console.log(`listening on HTTP port ${PORT}`));
