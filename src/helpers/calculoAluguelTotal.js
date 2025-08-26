import formatCurrency from '@/helpers/formatCurrency'

const calculoAluguelTotal = (valorAluguel, valorCondominio, valorIptu) => {

  // Garantir que os valores são números
  const aluguelNum = Number(valorAluguel);
  const condominioNum = Number(valorCondominio);
  const iptuNum = Number(valorIptu);

  const iptuParcelado = iptuNum / 12;
  const aluguelTotal = aluguelNum + condominioNum + iptuParcelado;
  const traducaoCurrencyAluguel = formatCurrency(aluguelTotal);

  return traducaoCurrencyAluguel;
}

export default calculoAluguelTotal
