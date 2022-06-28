type address = {
  logradouro: string,
  numero: string,
  complemento: string,
  bairro: string,
  codigo_municipio: string,
  cidade: string,
  uf: string,
  codigo_pais: string,
  pais: string,
  cep: string
}

type companyModel = {
  cpf_cnpj: string,
  created_at: string,
  updated_at: string,
  inscricao_estadual: string,
  inscricao_municipal: string,
  nome_razao_social: string,
  nome_fantasia: string,
  fone: string,
  email: string,
  endereco: address,
  optante_simples_nacional: true,
  regime_tributacao: 0,
  regime_especial_tributacao: 0,
  incentivo_fiscal: true,
  incentivador_cultural: true,
  nfe: {
    ambiente?: string
  },
  nfce: {
    sefaz: {
      id_csc: 0,
      csc: string
    },
    ambiente?: string
  },
  mdfe: {
    ambiente?: string
  },
  cte: {
    ambiente?: string
  },
  cte_os: {
    ambiente?: string
  },
  nfse: {
    rps: {
      lote: 0,
      serie: string,
      numero: 0
    },
    prefeitura: {
      login: string,
      senha: string,
      token: string
    },
    ambiente?: string
  }
}

export default companyModel;