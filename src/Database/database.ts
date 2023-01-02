import * as uuid from "uuid";
import { IUser } from "../Interfaces/user";

let usersDatabase: IUser[] = [];

async function createNewUserInDB(user: IUser): Promise<IUser> {
  return new Promise((resolve, reject) => {
    const newUser = { ...user, id: uuid.v4() };
    usersDatabase.push(newUser);
    resolve(newUser);
  });
}

async function getAllUsersFromDB(): Promise<IUser[]> {
  return new Promise((resolve, reject) => resolve(usersDatabase));
}

async function getUserByIdFromDB(id: string): Promise<IUser | null> {
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
  return new Promise((resolve, reject) => {
    const index = usersDatabase.findIndex((user) => userData.id === user.id);
    usersDatabase[index] = { ...userData, id: userData.id };
    //if (index) {
    resolve(usersDatabase[index]);
    /*  } else {
      reject(null);
    } */
  });
}

async function deleteUserByIdInDB(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    /*  usersDatabase = usersDatabase.filter((user) => user.id !== id);
    resolve(); */
    const index = usersDatabase.findIndex((user) => id === user.id);
    if (index) {
      usersDatabase.splice(index, 1);
      resolve(true);
    } else {
      reject(false);
    }
  });
}

export {
  createNewUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserByIdInDB,
};
