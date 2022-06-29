import express from 'express';
import cors from 'cors';
import router from './routes/gateway-routes';
const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

const app = express();

const authorizationToken =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODU0NTIzMzMsInRlbmFudF9pZCI6IldhZ25lciBNb2JpbGUgQ29zdGEjOTY2OCJ9.zBC9QpfHhDJmFWI9yUxeQNv819piFqN8v6utLOSJphI';

var allowCors = (req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, X-Access-Token, X-Key");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Credentials", "true");
  app.use(cors());
  next();
}

app.use(allowCors);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //


app.use('/', (req, res, next) => {
  const token = req.headers['authorization'];
  // console.log(req.headers);

  try {
    const token = req.header('authorization');

    if (token === authorizationToken) {
      router(req, res, next);
    } else {
      res.status(401);
    }
  } catch (error) {
    return res.status(401).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Gateway rodando na porta ${process.env.PORT}`);
});
