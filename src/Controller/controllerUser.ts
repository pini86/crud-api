import { IncomingMessage, ServerResponse } from "http";
import {
  createNewUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserByIdInDB,
} from "../Database/database";
import { createResponse } from "../Utils/utils";
import { HTTP_CODE, ERROR_MESSAGES } from "../Constants/constants";
import { parseRequest } from "../ParseRequest/parseRequest";

async function getAllUsers(req: IncomingMessage, res: ServerResponse) {
  try {
    const allUsers = await getAllUsersFromDB();
    createResponse(HTTP_CODE.OK, allUsers, res);
  } catch (err) {
    createResponse(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      {
        message:
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR +
          ERROR_MESSAGES.RESOURCE_NOT_FOUND,
      },
      res
    );
  }
}

async function createUser(req: IncomingMessage, res: ServerResponse) {
  try {
    const content = await parseRequest(req, res);
    const { username, age, hobbies } = content;

    if (!username || !age || !hobbies)
      return createResponse(
        HTTP_CODE.BAD_REQUEST,
        { message: ERROR_MESSAGES.BODY_VALIDATION },
        res
      );

    const newUser = await createNewUserInDB({
      id: "",
      username,
      age,
      hobbies,
    });
    createResponse(HTTP_CODE.CREATED, newUser, res);
  } catch (err) {
    createResponse(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      res
    );
  }
}

async function getUserById(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) {
  const user = await getUserByIdFromDB(id);
  if (!user)
    return createResponse(
      HTTP_CODE.NOT_FOUND,
      { message: ERROR_MESSAGES.USER_NOT_FOUND },
      res
    );

  createResponse(HTTP_CODE.OK, user, res);
}

async function deleteUserById(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) {
  const user = await getUserByIdFromDB(id);
  if (!user)
    return createResponse(
      HTTP_CODE.NOT_FOUND,
      { message: ERROR_MESSAGES.USER_NOT_FOUND },
      res
    );

  await deleteUserByIdInDB(id);
  createResponse(
    HTTP_CODE.NO_CONTENT,
    { message: `Complete. User ${id} has been removed.` },
    res
  );
}

async function updateUserById(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) {
  try {
    const user = await getUserByIdFromDB(id);
    if (!user)
      return createResponse(
        HTTP_CODE.NOT_FOUND,
        { message: ERROR_MESSAGES.USER_NOT_FOUND },
        res
      );

    const { username, age, hobbies } = await parseRequest(req, res); //переделать
    const userData = {
      id,
      username: username ?? user.username,
      age: age ?? user.age,
      hobbies: hobbies ?? user.hobbies,
    };

    const updatedUser = await updateUserInDB(userData);
    createResponse(HTTP_CODE.OK, updatedUser, res);
  } catch (err) {
    createResponse(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      res
    );
  }
}

export { getAllUsers, createUser, getUserById, deleteUserById, updateUserById };
