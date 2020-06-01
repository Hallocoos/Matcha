import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config({ path: 'conf.env' });

const app = express();
const http = require('http').Server(app);

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

app.set('view engine', 'html');
/*
Routes
*/
// import route from './routes/{route}';
import verifyLogin from './routes/users/findUserByUsernameAndPassword';
import findUser from './routes/users/findUserById';
import upsertUser from './routes/users/upsertUser';
import verifyUser from './routes/users/verifyUserById';
import setUserPassword from './routes/users/setUserPasswordById';
import upsertImage from './routes/images/upsertImage';

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/', verifyLogin, findUser, upsertUser, verifyUser, setUserPassword, upsertImage);

const server = http.listen(process.env.PORT, () => {
  console.info('Server now listening on', server.address().port);
});

export default app;