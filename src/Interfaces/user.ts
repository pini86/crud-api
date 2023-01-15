interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface IMessage {
  cmd: string;
  data: string;
}

export { IUser, IMessage };
