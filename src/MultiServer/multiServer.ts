import cluster from "cluster";
import { cpus } from "node:os";
import * as path from "path";
import * as http from "http";
import * as dotenv from "dotenv";
import { HTTP_CODE } from "../Constants/constants";
import { usersDatabase, refreshDB } from "../Database/database";
import { IMessage } from "../Interfaces/user";

const SERVER_PATH = "../Server/server";
const PATH_ENV = path.resolve(process.cwd(), ".env");
dotenv.config({ path: PATH_ENV });
const PORT: number | string = process.env.PORT ?? 4000;
let currentPort = +PORT + 1;

process.on("unhandledRejection", (err) => console.log(err));
process.on("uncaughtException", (err) => console.log(err));

void (async () => {
  if (cluster.isPrimary) {
    console.log(`Primary server ${process.pid} is running on port ${PORT}`);

    const countCpus = cpus().length;
    for (let i = 0; i < countCpus; i++) {
      cluster.fork({ PORT: +PORT + 1 + i });
    }

    http
      .createServer(function (request, response) {
        response
          .writeHead(HTTP_CODE.TEMPORARY_REDIRECT, {
            Location: `http://localhost:${currentPort}` + request.url,
          })
          .end(() => {
            console.log(`Request forwarded on port ${currentPort}`);
            currentPort = ++currentPort;
            if (currentPort > +PORT + countCpus) {
              currentPort = currentPort - countCpus;
            }
          });
      })
      .listen(PORT);
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died, R.I.P.`);
    });
    cluster.on("message", async (worker, message: IMessage) => {
      if (message.cmd === "refresh") {
        worker.send(JSON.stringify(usersDatabase));
      } else {
        refreshDB(message.data);
      }
    });
  } else {
    await import(SERVER_PATH).then(() =>
      console.log(`Worker ${process.pid} started,`)
    );
  }
})();
