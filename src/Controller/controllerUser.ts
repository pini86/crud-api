import http from "http";
import {
  createNewUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserByIdInDB,
} from "../Database/database";
import { createResponse } from "../Utils/utils";
import { HTTP_CODE } from "../Constants/constants";
import { parseRequest } from "../ParseRequest/parseRequest";

async function getAllUsers(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  try {
    const allUsers = await getAllUsersFromDB();
    createResponse(HTTP_CODE.OK, allUsers, res);
  } catch (err) {
    createResponse(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      { message: "Server error, couldn't get all users." },
      res
    );
  }
}

async function createUser(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const content = await parseRequest(req, res);
    const { username, age, hobbies } = content;

    if (!username || !age || !hobbies)
      return createResponse(
        HTTP_CODE.BAD_REQUEST,
        { message: "not all fields are specified" },
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
      "Internal server error",
      res
    );
  }
}

async function getUserById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  const user = await getUserByIdFromDB(id);
  if (!user)
    return createResponse(
      HTTP_CODE.NOT_FOUND,
      { message: "user with such id doesn't exist" },
      res
    );

  createResponse(HTTP_CODE.OK, user, res);
}

async function deleteUserById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  const user = await getUserByIdFromDB(id);
  if (!user)
    return createResponse(
      HTTP_CODE.NOT_FOUND,
      { message: "user with such id doesn't exist" },
      res
    );

  await deleteUserByIdInDB(id);
  createResponse(
    HTTP_CODE.NO_CONTENT,
    { message: `user ${id} has been removed` },
    res
  );
}

async function updateUserById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const user = await getUserByIdFromDB(id);
    if (!user)
      return createResponse(
        HTTP_CODE.NOT_FOUND,
        { message: "user with such id doesn't exist" },
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
      "Internal server error",
      res
    );
  }
}

export { getAllUsers, createUser, getUserById, deleteUserById, updateUserById };
