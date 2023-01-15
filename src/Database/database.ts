import * as uuid from "uuid";
import { IUser } from "../Interfaces/user";
import { ERROR_MESSAGES } from "../Constants/constants";
import cluster from "cluster";

let usersDatabase: IUser[] = [];

function refreshDB(freshDB: string): void {
  usersDatabase = [...JSON.parse(freshDB)];
}

async function getDBfromPrimary(): Promise<IUser[]> {
  return new Promise((resolve, reject) => {
    const result = process.send(
      { cmd: "refresh", data: JSON.stringify(usersDatabase) },
      () => {
        process.once("message", (msg: string) => {
          resolve((usersDatabase = [...JSON.parse(msg)]));
        });
      }
    );
    if (!result) {
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  });
}

async function sendDBtoPrimary(currentDB: IUser[]): Promise<void> {
  if (cluster.isWorker) {
    return new Promise((resolve, reject) => {
      const result = process.send({
        cmd: "",
        data: JSON.stringify(currentDB),
      });

      if (!result) {
        throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      } else {
        resolve();
      }
    });
  }
}

async function createNewUserInDB(user: IUser): Promise<IUser> {
  if (cluster.isWorker) {
    await getDBfromPrimary();
  }
  return new Promise(async (resolve, reject) => {
    const newUser = { ...user, id: uuid.v4() };
    usersDatabase.push(newUser);
    await sendDBtoPrimary(usersDatabase);
    resolve(newUser);
  });
}

async function getAllUsersFromDB(): Promise<IUser[]> {
  if (cluster.isWorker) {
    await getDBfromPrimary();
  }
  return new Promise((resolve, reject) => resolve(usersDatabase));
}

async function getUserByIdFromDB(id: string): Promise<IUser | null> {
  if (cluster.isWorker) {
    await getDBfromPrimary();
  }
  return new Promise((resolve, reject) => {
    const user = usersDatabase.find((user) => id === user.id);
    if (user) {
      resolve(user);
    } else {
      reject(null);
    }
  });
}

async function updateUserInDB(userData: IUser): Promise<IUser> {
  if (cluster.isWorker) {
    await getDBfromPrimary();
  }
  return new Promise(async (resolve, reject) => {
    const index = usersDatabase.findIndex((user) => userData.id === user.id);
    usersDatabase[index] = { ...userData, id: userData.id };
    await sendDBtoPrimary(usersDatabase);
    resolve(usersDatabase[index]);
  });
}

async function deleteUserByIdInDB(id: string): Promise<void> {
  if (cluster.isWorker) {
    await getDBfromPrimary();
  }
  return new Promise(async (resolve, reject) => {
    const index = usersDatabase.findIndex((user) => id === user.id);
    if (index !== -1) {
      usersDatabase.splice(index, 1);
      await sendDBtoPrimary(usersDatabase);
      resolve();
    } else {
      reject();
    }
  });
}

export {
  createNewUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserByIdInDB,
  usersDatabase,
  refreshDB,
};
