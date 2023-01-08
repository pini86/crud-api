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
import { HTTP_CODE, ERROR_MESSAGES } from "../Constants/constants";

const API = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT",
};

const PATH_ENV = path.resolve(process.cwd(), ".env");
dotenv.config({ path: PATH_ENV });

process.on("unhandledRejection", (err) => console.log(err));
process.on("uncaughtException", (err) => console.log(err));

const PORT: number | string = process.env.PORT ?? 4000;

const server = http
  .createServer({ insecureHTTPParser: true }, async (request, response) => {
    try {
      if (!request.url) return notFoundResponse(request.url ?? "", response);

      if (request.url === "/api/users") {
        if (request.method === API.GET)
          return await getAllUsers(request, response);
        if (request.method === API.POST)
          return await createUser(request, response);
      }

      if (request.url.startsWith("/api/users/")) {
        const uuid = request.url.split("/").slice(3).join("/");
        if (!validate(uuid))
          return createResponse(
            HTTP_CODE.BAD_REQUEST,
            ERROR_MESSAGES.USERID_INVALID,
            response
          );

        if (request.method === API.DELETE)
          return await deleteUserById(request, response, uuid);
        if (request.method === API.PUT)
          return await updateUserById(request, response, uuid);
        if (request.method === API.GET)
          return await getUserById(request, response, uuid);
      }
      return notFoundResponse(request.url ?? "", response);
    } catch (err) {
      createResponse(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        response
      );
    }
  })
  .on("error", (err) => {
    console.log(`${ERROR_MESSAGES.UNEXPECTED_ERROR} ${JSON.stringify(err)}`);
  })
  .on("clientError", (err, socket) => {
    socket.end(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  });

export { server };

server
  .listen(PORT)
  .on("listening", () => console.log(`listening on HTTP port ${PORT}`));
