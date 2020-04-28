import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config({ path: 'conf.env' });

const app = express();
const http = require("http").Server(app);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

function loggerMiddleware(request: Request, response: Response, next): void {
  if (request.method !== 'HEAD') {
    const date = new Date().toISOString();
    console.info(`${date} - ${request.method} ${request.path}`);
  }
  next();
}
app.use(loggerMiddleware);

app.set("view engine", "html");
/*
Routes
*/
import login from './routes/login';
import findUser from './routes/findUser';
import upsertUser from './routes/upsertUser';
// import route from './routes/route';
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/', login, findUser, upsertUser);

const server = http.listen(process.env.PORT, () => {
  console.info("Server now listening on", server.address().port);
});

export default app;