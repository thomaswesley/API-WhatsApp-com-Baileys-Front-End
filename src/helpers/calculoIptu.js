import formatCurrency from '@/helpers/formatCurrency'

const calculoIptu = (value) => {

  // Garantir que os valores são números
  const iptuNum = Number(value);

  const iptuParcelado = iptuNum / 12;
  const traducaoIptuParcelado = formatCurrency(iptuParcelado);

  return traducaoIptuParcelado;
}

export default calculoIptu
