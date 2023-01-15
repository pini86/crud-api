import { IncomingMessage, ServerResponse } from "http";
import {
  createNewUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserByIdInDB,
} from "../Database/database";
import { createResponse, checkUser } from "../Utils/utils";
import { HTTP_CODE, ERROR_MESSAGES } from "../Constants/constants";
import { parseRequest } from "../ParseRequest/parseRequest";

async function getAllUsers(req: IncomingMessage, res: ServerResponse) {
  try {
    const allUsers = await getAllUsersFromDB();
    createResponse(HTTP_CODE.OK, allUsers, res);
  } catch (err) {
    createResponse(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR + ERROR_MESSAGES.RESOURCE_NOT_FOUND,
      res
    );
  }
}

async function createUser(req: IncomingMessage, res: ServerResponse) {
  try {
    const content = await parseRequest(req, res);

    let { username, age, hobbies } = content;

    username = username.trim();

    if (!checkUser(content)) {
      return createResponse(
        HTTP_CODE.BAD_REQUEST,
        ERROR_MESSAGES.BODY_VALIDATION,
        res
      );
    }

    const newUser = await createNewUserInDB({
      id: "",
      username,
      age,
      hobbies,
    });
    createResponse(HTTP_CODE.CREATED, newUser, res);
  } catch (err) {
    createResponse(HTTP_CODE.BAD_REQUEST, ERROR_MESSAGES.BODY_VALIDATION, res);
  }
}

async function getUserById(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) {
  try {
    const user = await getUserByIdFromDB(id);
    if (!user)
      return createResponse(
        HTTP_CODE.NOT_FOUND,
        ERROR_MESSAGES.USER_NOT_FOUND,
        res
      );

    createResponse(HTTP_CODE.OK, user, res);
  } catch (err) {
    createResponse(HTTP_CODE.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND, res);
  }
}

async function deleteUserById(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) {
  try {
    const user = await getUserByIdFromDB(id);

    if (!user)
      return createResponse(
        HTTP_CODE.NOT_FOUND,
        ERROR_MESSAGES.USER_NOT_FOUND,
        res
      );

    await deleteUserByIdInDB(id);

    createResponse(HTTP_CODE.NO_CONTENT, "", res);
  } catch (err) {
    createResponse(HTTP_CODE.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND, res);
  }
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
        ERROR_MESSAGES.USER_NOT_FOUND,
        res
      );

    const { username, age, hobbies } = await parseRequest(req, res);
    const userNewData = {
      id,
      username,
      age,
      hobbies,
    };

    if (!checkUser(userNewData)) {
      return createResponse(
        HTTP_CODE.BAD_REQUEST,
        ERROR_MESSAGES.BODY_VALIDATION,
        res
      );
    }

    const updatedUser = await updateUserInDB(userNewData);
    createResponse(HTTP_CODE.OK, updatedUser, res);
  } catch (err) {
    createResponse(HTTP_CODE.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND, res);
  }
}

export { getAllUsers, createUser, getUserById, deleteUserById, updateUserById };
