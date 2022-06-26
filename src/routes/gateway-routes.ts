import express from 'express';
import httpProxy from 'express-http-proxy';

const NUVEM_FISCAL = 'api.sandbox.nuvemfiscal.com.br';

const router = express.Router();

const optionsProxy: httpProxy.ProxyOptions = {
  https: true, // Queremos um proxy https.
  // Método reponsavél por fazer a autorização na api nuvem fiscal.
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.headers = {
      'Authorization':
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODU0NTIzMzMsInRlbmFudF9pZCI6IldhZ25lciBNb2JpbGUgQ29zdGEjOTY2OCJ9.zBC9QpfHhDJmFWI9yUxeQNv819piFqN8v6utLOSJphI',
    };
    return proxyReqOpts;
  },
  // Responsavél por fazer com que as rotas que passemos execute o comportamento desejado.
  proxyReqPathResolver: function (req) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {   // simulate async
        var parts = req.url.split('?');
        var queryString = parts[1];
        var updatedPath = parts[0].replace(/test/, 'tent');
        var resolvedPathValue = updatedPath + (queryString ? '?' + queryString : '');
        resolve(resolvedPathValue);
      }, 200);
    });
  },
};


// Esse método é responsavel por modificar a reposta da api nuvem fiscal e retornar para o cliente apenas os dados que ele irá utilizar.
const empresasTransform = (proxyRes: any, proxyResData: any, userReq: any, userRes: any) => {
  let data = JSON.parse(proxyResData.toString('utf8'));

  delete data['@count'];
  data.hasnext = false;

  return JSON.stringify(data);
}


router.get('/empresas', httpProxy(NUVEM_FISCAL, { ...optionsProxy, userResDecorator: empresasTransform }));
router.get('/cnpj/:id', httpProxy(NUVEM_FISCAL, optionsProxy));

export default router;
