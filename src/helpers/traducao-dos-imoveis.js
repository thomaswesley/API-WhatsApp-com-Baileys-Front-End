'use client'

const TipoImovel = (tipo) => {

  let data = {
    tipo_imovel: ''
  }

  if (tipo) {

    switch (tipo) {
      case 1:
        data.tipo_imovel = 'Apartamento';
        break;
      case 2:
        data.tipo_imovel = 'Kitnet';
        break;
      case 3:
        data.tipo_imovel = 'Casa';
        break;
      case 4:
        data.tipo_imovel = 'Casa em condomínio';
        break;

      default:
        data.tipo_imovel = 'Apartamento';
        break;
    }
  }

  return data
};

const QuantidadeQuartos = (quantidade) => {

  let data = {
    quartos_incluindo_suites: ''
  }

  if (quantidade) {

    switch (quantidade) {
      case 1:
        data.quartos_incluindo_suites = 'quarto';
        break;

      default:
        data.quartos_incluindo_suites = 'quartos';
        break;
    }
  }

  return data
};

const QuantidadeVagas = (vagas) => {

  let data = {
    garagens: ''
  }

  if (vagas) {

    switch (vagas) {
      case 1:
        data.garagens = 'vaga';
        break;

      default:
        data.garagens = 'vagas';
        break;
    }
  
  } else {
    data.garagens = 'sem vaga';
  }

  return data
};

const TipoAnuncio = (value) => {

  let data = {
    tipoAnuncio: ''
  }

  if (value) {

    switch (value) {
      case '1':
        data.tipoAnuncio = 'alugar';
        break;

      case '2':
        data.tipoAnuncio = 'comprar';
        break;

      default:
        data.tipoAnuncio = 'indefinido';
        break;
    }
  }

  return data
};

export { TipoImovel, QuantidadeQuartos, QuantidadeVagas, TipoAnuncio };
