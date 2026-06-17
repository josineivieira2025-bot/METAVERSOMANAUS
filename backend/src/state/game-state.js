export const gameState = {
  server: {
    phase: 'mvp-prototype',
    onlinePlayers: 128,
    targetConcurrentPlayers: 100000,
    tickRate: 20
  },
  world: {
    time: {
      day: 1,
      hour: 6,
      minute: 30,
      speed: '12x'
    },
    weather: {
      condition: 'chuva amazonica',
      intensity: 72,
      floodRisk: 'moderado',
      temperatureCelsius: 27
    },
    districts: [
      { id: 'centro', name: 'Centro', population: 380, traffic: 76, floodRisk: 58, unlocked: true },
      { id: 'distrito-industrial', name: 'Distrito Industrial', population: 210, traffic: 68, floodRisk: 34, unlocked: true },
      { id: 'ponta-negra', name: 'Ponta Negra', population: 160, traffic: 42, floodRisk: 18, unlocked: true },
      { id: 'cidade-nova', name: 'Cidade Nova', population: 0, traffic: 0, floodRisk: 0, unlocked: false },
      { id: 'adrianopolis', name: 'Adrianopolis', population: 0, traffic: 0, floodRisk: 0, unlocked: false },
      { id: 'taruma', name: 'Taruma', population: 0, traffic: 0, floodRisk: 0, unlocked: false }
    ]
  },
  jobs: [
    {
      id: 'app-driver',
      name: 'Motorista de aplicativo',
      category: 'Transporte',
      salaryCents: 180000,
      xpReward: 22,
      district: 'Centro',
      mission: 'Levar passageiro do Centro ate Ponta Negra respeitando transito e chuva.'
    },
    {
      id: 'motoboy',
      name: 'Motoboy',
      category: 'Entrega',
      salaryCents: 160000,
      xpReward: 26,
      district: 'Adrianopolis',
      mission: 'Entregar refeicao durante chuva intensa sem atrasar o pedido.'
    },
    {
      id: 'logistics-operator',
      name: 'Operador Logistico',
      category: 'Industria',
      salaryCents: 220000,
      xpReward: 30,
      district: 'Distrito Industrial',
      mission: 'Conferir carga, organizar estoque e liberar rota de caminhao.'
    },
    {
      id: 'seller',
      name: 'Vendedor',
      category: 'Comercio',
      salaryCents: 170000,
      xpReward: 20,
      district: 'Centro',
      mission: 'Atender clientes, repor estoque e fechar vendas no comercio local.'
    },
    {
      id: 'police-officer',
      name: 'Policial',
      category: 'Seguranca publica',
      salaryCents: 350000,
      xpReward: 34,
      district: 'Centro',
      mission: 'Patrulhar area publica e responder ocorrencia com protocolo de roleplay.'
    }
  ],
  economy: {
    currency: 'MNV',
    bank: 'Banco Solimoes',
    market: [
      { code: 'gasoline_liter', name: 'Gasolina comum', priceCents: 640, demand: 82, supply: 51 },
      { code: 'meal_basic', name: 'Refeicao simples', priceCents: 2200, demand: 77, supply: 70 },
      { code: 'delivery_fee', name: 'Taxa de entrega local', priceCents: 900, demand: 61, supply: 58 },
      { code: 'warehouse_rent', name: 'Aluguel de galpao', priceCents: 850000, demand: 88, supply: 24 },
      { code: 'starter_apartment_rent', name: 'Aluguel de apartamento inicial', priceCents: 95000, demand: 74, supply: 39 }
    ],
    transactions: []
  },
  characters: [
    {
      id: 'char-demo',
      fullName: 'Ariane Souza',
      gender: 'Mulher',
      district: 'Centro',
      level: 1,
      experience: 0,
      walletCents: 250000,
      activeJobId: null,
      needs: {
        hunger: 82,
        thirst: 78,
        sleep: 64,
        energy: 71,
        health: 96,
        hygiene: 88,
        stress: 18,
        happiness: 62
      }
    }
  ]
};

export function findCharacter(characterId) {
  return gameState.characters.find((character) => character.id === characterId);
}

export function centsToDisplay(cents) {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).replace('R$', 'MNV');
}
