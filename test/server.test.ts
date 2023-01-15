import * as http from "http";
import supertest from "supertest";
import { server } from "../src/Server/server";
import { HTTP_CODE } from "../src/Constants/constants";

const stopServer = async (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => new Promise<void>((res) => server.close(() => res()));

const API_ADRESS = "/api/users";
const TEST_USER = {
  username: "Monty Python",
  age: 44,
  hobbies: ["scary movies"],
  id: "",
};
const TEST_USER_UPDATED = {
  username: "Monty Python Forever",
  age: 33,
  hobbies: ["funny movies"],
  id: "",
};

describe("Server tests.", () => {
  afterAll(async () => await stopServer(server));

  it("Case: empty DataBase.", async () => {
    const response = await supertest(server).get(API_ADRESS);

    expect(response.statusCode).toBe(HTTP_CODE.OK);
    expect(response.body).toEqual([]);
  });

  it("Case: create new user", async () => {
    const response = await supertest(server)
      .post(API_ADRESS)
      .send(JSON.stringify(TEST_USER));

    expect(response.statusCode).toBe(HTTP_CODE.CREATED);
    expect(response.body.id).not.toBe("");

    TEST_USER.id = response.body.id;

    expect(response.body).toEqual(TEST_USER);
  });

  it("Case: get existing user", async () => {
    const response = await supertest(server).get(
      `${API_ADRESS}/${TEST_USER.id}`
    );

    expect(response.statusCode).toBe(HTTP_CODE.OK);
    expect(response.body).toEqual(TEST_USER);
  });

  it("Case: update existing user", async () => {
    const response = await supertest(server)
      .put(`${API_ADRESS}/${TEST_USER.id}`)
      .send(JSON.stringify(TEST_USER_UPDATED));

    expect(response.statusCode).toBe(HTTP_CODE.OK);

    TEST_USER_UPDATED.id = TEST_USER.id;

    expect(response.body).toEqual(TEST_USER_UPDATED);
  });

  it("Case: delete existing user", async () => {
    const response = await supertest(server).delete(
      `${API_ADRESS}/${TEST_USER.id}`
    );

    expect(response.statusCode).toBe(HTTP_CODE.NO_CONTENT);
  });

  it("Case: try get deleted user", async () => {
    const response = await supertest(server).get(
      `${API_ADRESS}/${TEST_USER.id}`
    );

    expect(response.statusCode).toBe(HTTP_CODE.NOT_FOUND);
    expect(response.body.message).not.toBeUndefined;
  });

  it("Case: try create new user with non valid fields", async () => {
    const WRONG_USER = { age: "non valid" };
    const response = await supertest(server)
      .post(API_ADRESS)
      .send(JSON.stringify(WRONG_USER));

    expect(response.statusCode).toBe(HTTP_CODE.BAD_REQUEST);
  });

  it("Case: requests to non-existing endpoints", async () => {
    const WRONG_WAY = "/somewhere";
    const response = await supertest(server).get(WRONG_WAY);

    expect(response.statusCode).toBe(HTTP_CODE.NOT_FOUND);
  });
});
