import express from 'express';
import httpProxy from 'express-http-proxy';
import companyModel from '../models/company';

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

// Função auxiliar que prefixa
function prefixObj(obj: object, prefix: string): object {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => {
    return [`${prefix}${key}`, typeof value === 'object' ? prefixObj(value, prefix) : value];
  }));
}

// Esse método é responsavel por modificar a reposta da api nuvem fiscal e retornar para o cliente apenas os dados que ele irá utilizar.
const transformResCompany = (proxyRes: any, proxyResData: any, userReq: any, userRes: any) => {
  let resProxy = JSON.parse(proxyResData.toString('utf8'));

  delete resProxy['@count'];
  resProxy.hasnext = false;

  const newData = resProxy.data.map((data: companyModel) => {
    const newRes: any = Object.assign({}, data, prefixObj(data.endereco, 'endereco_'))
    delete newRes['endereco'];
    return newRes
  })

  const newRes = { ...resProxy, data: newData }

  return JSON.stringify(newRes);
}

const transformResCompanyID = (proxyRes: any, proxyResData: any, userReq: any, userRes: any) => {
  let resProxy = JSON.parse(proxyResData.toString('utf8'));

  const newRes: any = Object.assign({}, resProxy, prefixObj(resProxy.endereco, 'endereco_'))
  delete newRes['endereco'];

  return JSON.stringify(newRes);
}


/**EMPRESAS */
router.get('/empresas', httpProxy(NUVEM_FISCAL, { ...optionsProxy, userResDecorator: transformResCompany }));

router.get('/empresas/:cpf_cnpj', httpProxy(NUVEM_FISCAL, { ...optionsProxy, userResDecorator: transformResCompanyID }));

router.patch('/empresas/:cpf_cnpj', httpProxy(NUVEM_FISCAL, optionsProxy));

router.get('/cnpj/:id', httpProxy(NUVEM_FISCAL, optionsProxy));

router.get('/nfse', httpProxy(NUVEM_FISCAL, optionsProxy));

export default router;
