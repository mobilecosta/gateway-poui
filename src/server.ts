import express from 'express';
import cors from 'cors';
import router from './routes/gateway-routes';

const PORT = process.env.PORT_HTTPS_PORTAL || 8080;
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //

const authorizationToken =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODU0NTIzMzMsInRlbmFudF9pZCI6IldhZ25lciBNb2JpbGUgQ29zdGEjOTY2OCJ9.zBC9QpfHhDJmFWI9yUxeQNv819piFqN8v6utLOSJphI';

app.use('/', (req, res, next) => {
  const token = req.headers['authorization'];

  if (token && token === authorizationToken) {
    router(req, res, next);
  } else {
    res.status(401).send("Unauthorized")
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso`);
});
