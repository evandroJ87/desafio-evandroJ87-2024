// Dados dos recintos
const recintos = [
  { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: ['macaco', 'macaco', 'macaco'] },
  { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
  { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: ['gazela'] },
  { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
  { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: ['leao'] }
];

// Dados dos animais
const animais = {
  leao: { tamanho: 3, bioma: ['savana'], carnivoro: true },
  leopardo: { tamanho: 2, bioma: ['savana'], carnivoro: true },
  crocodilo: { tamanho: 3, bioma: ['rio'], carnivoro: true },
  macaco: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
  gazela: { tamanho: 2, bioma: ['savana'], carnivoro: false },
  hipopotamo: { tamanho: 4, bioma: ['savana e rio'], carnivoro: false }
};

  class RecintosZoo{
   analisaRecintos(animal, quantidade) {
  // Validar tipo de animal
  if (!animais[animal.toLowerCase()]) {
    return {erro:"Animal inválido"};
  }

  // Validar quantidade
  if (quantidade <= 0 || !Number.isInteger(quantidade)) {
    return {erro:"Quantidade inválida"};
  }

  const animalInfo = animais[animal.toLowerCase()];
  const tamanhoNecessario = animalInfo.tamanho * quantidade;

  // Encontrar recintos viáveis
const recintosViaveis = recintos.filter(recinto => {
  const { bioma, tamanhoTotal, animaisExistentes } = recinto;

  // Verificar se o bioma do recinto é compatível
  const biomaValido = animalInfo.bioma.some(b => bioma.includes(b));
  if (!biomaValido) return false;

  // Condicional para hipopótamos
  if (animal.toLowerCase() === 'hipopotamo' && recinto.bioma !== 'savana e rio' && animaisExistentes.length > 0) {
    return false; // Hipopótamo só tolera outras espécies em 'savana e rio'
  }


  // Verificar se já há animais no recinto e se eles são compatíveis
  if (animaisExistentes.length > 0) {
    const primeiroAnimal = animaisExistentes[0];
    const infoPrimeiroAnimal = animais[primeiroAnimal];

    // Carnívoros só podem habitar com a mesma espécie
    if (animalInfo.carnivoro || infoPrimeiroAnimal.carnivoro) {
      if (primeiroAnimal !== animal.toLowerCase()) return false;
    }
    // Condicional para não separar lotes de animais
    if (tamanhoNecessario > recinto.tamanhoTotal - animaisExistentes) {
      return false;
  }

    // Macaco precisa de outro animal
    if (animal.toLowerCase() === 'macaco' && animaisExistentes.length === 0) {
      return false;
    }
  }

  // Calcular espaço necessário
  const totalAnimaisExistentes = animaisExistentes.reduce((sum, animal) => sum + animais[animal].tamanho, 0);
  let espacoOcupado = totalAnimaisExistentes + tamanhoNecessario;

  // Se houver mais de uma espécie, adicionar espaço extra
  if (animaisExistentes.length > 0 && animaisExistentes.some(a => a !== animal.toLowerCase())) {
    espacoOcupado += 1;
  }

  // Verificar se o recinto tem espaço suficiente
  return espacoOcupado <= tamanhoTotal;
});

// Se nenhum recinto for viável, retornar a mensagem de erro
if (recintosViaveis.length === 0) {
  return {erro: "Não há recinto viável"};
}

// Formatar a lista de recintos viáveis
return {
  recintosViaveis: recintosViaveis.map(recinto => {
    const totalAnimaisExistentes = recinto.animaisExistentes.reduce((sum, animal) => sum + animais[animal].tamanho, 0);
    let espacoLivre = recinto.tamanhoTotal - totalAnimaisExistentes - tamanhoNecessario;
    
    // Contabilizar um espaço extra se houver mais de uma espécie
    if (recinto.animaisExistentes.length > 0 && recinto.animaisExistentes.some(a => a !== animal.toLowerCase())) {
      espacoLivre -= 1;
    }
    
    return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
  })
};
   }}
export {RecintosZoo as RecintosZoo};