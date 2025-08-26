'use client'

const sanitizerUrl = (data) => {

  // ** Tranformar em letras minúsculas
  let passoA = data.toLowerCase();

  // ** Retirar acentuação se todas as palavras
  let passoB = passoA.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // ** Aceitar somente os caracteres dentro dos colchetes e substituir todo o restante por nada
  let passoC = passoB.replace(/[^a-zA-Z0-9 ]/g, '');

  // ** Remover os espaços em branco do início e fim da string
  let passoD = passoC.trim();

  // ** Substituir os espaços entre a string por um hífen
  let passoE = passoD.replace(/\s+/g, '-');

  return passoE
}

const ParamsUrl = (params) => {

  let data = {
    searchType: '',
    searchPropertieLocalizationUrlSanitizer: '',
    amount: '',
    bedrooms: ''
  }

  if (params.all.length) {

    params.all.forEach((value, index) => {

      switch (index) {
        case 0:

          switch (value) {
            case 'alugar':
              data.searchType = '1';
              break;
            case 'comprar':
              data.searchType = '2';
              break;

            default:
              data.searchType = '1';
              break;
          }
      }

      switch (index) {
        case 1:
          data.searchPropertieLocalizationUrlSanitizer = value;
          break;

        default:
      }

      switch (index) {
        case 2:

          // ** Aluguel

          if (data.searchType == '1') {
            const matches = value.match(/\d+/g); // pega todos os números
          
            if (matches && matches.length > 0) {
              const maxValue = Math.max(...matches.map(Number));
              data.amount = maxValue;
            } else {
              data.amount = 0;
            }
          }

          break;

          default:
      }

      switch (index) {
        case 2:

          // ** Venda

          if (data.searchType == '2') {
            const matches = value.match(/\d+/g); // pega todos os números
          
            if (matches && matches.length > 0) {
              const maxValue = Math.max(...matches.map(Number));
              data.amount = maxValue;
            } else {
              data.amount = 0;
            }
          }

          break;

          default:
      }

      switch (index) {
        case 3:

          switch (value) {
            case '1-2-3-4-quartos':
              data.bedrooms = '1';
              break;
            case '2-3-4-quartos':
              data.bedrooms = '2';
              break;
            case '3-4-quartos':
              data.bedrooms = '3';
              break;
            case '4-quartos':
              data.bedrooms = '4';
              break;

            default:
              data.bedrooms = '1';
          }
      }
    })
  }

  return data
};

const ParamPropertieCodeUrl = (params) => {

  let data = {
    propertieCode: ''
  }

  if (params.all.length) {

    params.all.forEach((value, index) => {

      switch (index) {

        case 0:

          data.propertieCode = value;
          break;

        default:
      }

    })
  }

  console.log('ParamPropertieCodeUrl', data)

  return data
};

const ParamPropertieCodeUrlProposal = (params) => {  

  let data = {
    propertieCode: '',
    searchType: ''
  }

  if (params.all.length) {

    params.all.forEach((value, index) => {

      switch (index) {

        case 2:

          data.propertieCode = value;
          break;

        case 0:

          data.searchType = value;
          break;

        default:
      }

    })
  }

  return data
};

const ParamPropertieSearchType = (params) => {

  let data = {
    searchType: ''
  }

  if (params.all.length) {

    params.all.forEach((value, index) => {

      switch (index) {
        case 1:

          switch (value) {
            case 'alugar':
              data.searchType = '1';
              break;
              
            case 'comprar':
              data.searchType = '2';
              break;

            default:
              data.searchType = '1';
              break;
          }
      }
      
    })
  }

  console.log('ParamPropertieSearchType', data)

  return data
};



export { ParamsUrl, sanitizerUrl, ParamPropertieCodeUrl, ParamPropertieCodeUrlProposal, ParamPropertieSearchType };
