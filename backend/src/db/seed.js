import { gameState } from '../state/game-state.js';

export async function seedMongo(db) {
  const worldCollection = db.collection('world_state');
  const jobsCollection = db.collection('jobs');
  const charactersCollection = db.collection('characters');
  const marketCollection = db.collection('market_items');
  const companiesCollection = db.collection('companies');
  const propertiesCollection = db.collection('properties');
  const vehiclesCollection = db.collection('vehicles');
  const inventoryCollection = db.collection('inventory_items');
  const missionsCollection = db.collection('missions');
  const mapDistrictsCollection = db.collection('map_districts');
  const mapLandmarksCollection = db.collection('map_landmarks');
  const mapRoutesCollection = db.collection('map_routes');
  const servicesCollection = db.collection('public_services');

  await worldCollection.updateOne(
    { id: 'main-world' },
    {
      $setOnInsert: {
        id: 'main-world',
        server: gameState.server,
        world: gameState.world,
        createdAt: new Date()
      },
      $set: { updatedAt: new Date() }
    },
    { upsert: true }
  );

  for (const job of gameState.jobs) {
    await jobsCollection.updateOne(
      { id: job.id },
      { $setOnInsert: { ...job, createdAt: new Date() }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );
  }

  for (const character of gameState.characters) {
    await charactersCollection.updateOne(
      { id: character.id },
      { $setOnInsert: { ...character, createdAt: new Date() }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );
  }

  for (const item of gameState.economy.market) {
    await marketCollection.updateOne(
      { code: item.code },
      { $setOnInsert: { ...item, createdAt: new Date() }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );
  }

  const companies = [
    {
      id: 'company-rio-negro-log',
      ownerCharacterId: 'char-demo',
      tradeName: 'Rio Negro Logistica',
      legalName: 'Rio Negro Logistica LTDA',
      type: 'transportadora',
      district: 'Distrito Industrial',
      employees: 8,
      cashCents: 12500000,
      stock: [{ code: 'electronics_parts', name: 'Componentes eletronicos', quantity: 420 }]
    },
    {
      id: 'company-tambaqui-food',
      ownerCharacterId: 'char-demo',
      tradeName: 'Tambaqui Express',
      legalName: 'Tambaqui Express Alimentos LTDA',
      type: 'restaurante',
      district: 'Centro',
      employees: 5,
      cashCents: 3800000,
      stock: [{ code: 'meal_basic', name: 'Refeicao simples', quantity: 85 }]
    }
  ];

  const properties = [
    {
      id: 'property-centro-ap-01',
      ownerCharacterId: 'char-demo',
      type: 'apartamento',
      district: 'Centro',
      addressLabel: 'Apartamento inicial Centro',
      priceCents: 18000000,
      rentCents: 95000,
      status: 'owned',
      rooms: 2
    },
    {
      id: 'property-galpao-di-01',
      ownerCompanyId: 'company-rio-negro-log',
      type: 'galpao',
      district: 'Distrito Industrial',
      addressLabel: 'Galpao logistico DI',
      priceCents: 125000000,
      rentCents: 850000,
      status: 'leased',
      rooms: 1
    }
  ];

  const vehicles = [
    {
      id: 'vehicle-moto-01',
      ownerCharacterId: 'char-demo',
      type: 'moto',
      model: 'Moto urbana 160',
      plate: 'MNS-1A60',
      fuelPercent: 82,
      conditionPercent: 91,
      district: 'Centro'
    },
    {
      id: 'vehicle-truck-01',
      ownerCompanyId: 'company-rio-negro-log',
      type: 'caminhao',
      model: 'Caminhao leve baú',
      plate: 'MNV-2B40',
      fuelPercent: 67,
      conditionPercent: 84,
      district: 'Distrito Industrial'
    }
  ];

  const inventoryItems = [
    { id: 'item-phone-demo', ownerType: 'character', ownerId: 'char-demo', code: 'smartphone', name: 'Celular in-game', quantity: 1 },
    { id: 'item-helmet-demo', ownerType: 'character', ownerId: 'char-demo', code: 'helmet', name: 'Capacete urbano', quantity: 1 },
    { id: 'item-meal-demo', ownerType: 'character', ownerId: 'char-demo', code: 'meal_basic', name: 'Marmita simples', quantity: 2 }
  ];

  const missions = [
    {
      id: 'mission-delivery-rain',
      title: 'Entrega na chuva',
      type: 'delivery',
      district: 'Centro',
      rewardCents: 1800,
      xpReward: 18,
      status: 'available',
      description: 'Retire um pedido no Centro e entregue antes do alagamento piorar.'
    },
    {
      id: 'mission-logistics-check',
      title: 'Conferencia de carga',
      type: 'logistics',
      district: 'Distrito Industrial',
      rewardCents: 3200,
      xpReward: 24,
      status: 'available',
      description: 'Confira estoque, libere nota e organize carga para transporte.'
    },
    {
      id: 'mission-police-patrol',
      title: 'Patrulha comunitaria',
      type: 'public_safety',
      district: 'Centro',
      rewardCents: 4500,
      xpReward: 28,
      status: 'available',
      description: 'Atenda ocorrencia leve usando protocolo de moderacao e roleplay.'
    }
  ];

  const publicServices = [
    { id: 'service-police', name: 'Policia Civil e Militar', type: 'seguranca', district: 'Centro', status: 'online', queue: 4 },
    { id: 'service-hospital', name: 'Hospital 28 de Agosto', type: 'saude', district: 'Adrianopolis', status: 'online', queue: 12 },
    { id: 'service-court', name: 'Forum de Manaus', type: 'justica', district: 'Centro', status: 'limited', queue: 7 },
    { id: 'service-city-hall', name: 'Prefeitura ficticia', type: 'politica', district: 'Centro', status: 'online', queue: 2 }
  ];

  const mapDistricts = [
    { id: 'map-centro', name: 'Centro', zone: 'central', x: 48, y: 54, width: 14, height: 13, traffic: 76, floodRisk: 58, unlocked: true },
    { id: 'map-porto', name: 'Porto de Manaus', zone: 'river', x: 43, y: 68, width: 12, height: 8, traffic: 64, floodRisk: 72, unlocked: true },
    { id: 'map-praca-saudade', name: 'Praca da Saudade', zone: 'central', x: 53, y: 49, width: 8, height: 7, traffic: 59, floodRisk: 43, unlocked: true },
    { id: 'map-distrito-industrial', name: 'Distrito Industrial', zone: 'industrial', x: 68, y: 64, width: 18, height: 16, traffic: 68, floodRisk: 34, unlocked: true },
    { id: 'map-ponta-negra', name: 'Ponta Negra', zone: 'west', x: 13, y: 42, width: 16, height: 12, traffic: 42, floodRisk: 18, unlocked: true },
    { id: 'map-taruma', name: 'Taruma', zone: 'west', x: 17, y: 22, width: 18, height: 15, traffic: 32, floodRisk: 24, unlocked: false },
    { id: 'map-aeroporto', name: 'Aeroporto Eduardo Gomes', zone: 'northwest', x: 27, y: 17, width: 14, height: 10, traffic: 51, floodRisk: 12, unlocked: true },
    { id: 'map-cidade-nova', name: 'Cidade Nova', zone: 'north', x: 50, y: 18, width: 18, height: 14, traffic: 63, floodRisk: 29, unlocked: false },
    { id: 'map-alvorada', name: 'Alvorada', zone: 'west-central', x: 34, y: 39, width: 13, height: 11, traffic: 61, floodRisk: 31, unlocked: false },
    { id: 'map-adrianopolis', name: 'Adrianopolis', zone: 'central-east', x: 59, y: 43, width: 11, height: 9, traffic: 67, floodRisk: 22, unlocked: true },
    { id: 'map-vieiralves', name: 'Vieiralves', zone: 'central-east', x: 51, y: 39, width: 10, height: 8, traffic: 72, floodRisk: 20, unlocked: true },
    { id: 'map-flores', name: 'Flores', zone: 'north-central', x: 45, y: 31, width: 12, height: 10, traffic: 57, floodRisk: 18, unlocked: false },
    { id: 'map-aleixo', name: 'Aleixo', zone: 'east-central', x: 67, y: 39, width: 12, height: 11, traffic: 49, floodRisk: 25, unlocked: false },
    { id: 'map-compensa', name: 'Compensa', zone: 'west-central', x: 24, y: 53, width: 13, height: 12, traffic: 55, floodRisk: 47, unlocked: false },
    { id: 'map-coroado', name: 'Coroado', zone: 'east', x: 75, y: 47, width: 12, height: 10, traffic: 53, floodRisk: 28, unlocked: false },
    { id: 'map-sao-jose', name: 'Sao Jose', zone: 'east', x: 82, y: 38, width: 12, height: 11, traffic: 66, floodRisk: 36, unlocked: false },
    { id: 'map-jorge-teixeira', name: 'Jorge Teixeira', zone: 'far-east', x: 88, y: 28, width: 10, height: 12, traffic: 58, floodRisk: 32, unlocked: false },
    { id: 'map-educandos', name: 'Educandos', zone: 'south', x: 55, y: 73, width: 12, height: 9, traffic: 62, floodRisk: 69, unlocked: false },
    { id: 'map-cachoeirinha', name: 'Cachoeirinha', zone: 'south-central', x: 59, y: 61, width: 11, height: 8, traffic: 65, floodRisk: 52, unlocked: false }
  ];

  const mapLandmarks = [
    { id: 'lm-port', name: 'Porto de Manaus', type: 'porto', districtId: 'map-porto', x: 47, y: 72 },
    { id: 'lm-airport', name: 'Aeroporto Internacional Eduardo Gomes', type: 'aeroporto', districtId: 'map-aeroporto', x: 33, y: 22 },
    { id: 'lm-bus', name: 'Rodoviaria', type: 'transporte', districtId: 'map-flores', x: 49, y: 33 },
    { id: 'lm-mall', name: 'Shopping Manaus', type: 'shopping', districtId: 'map-adrianopolis', x: 63, y: 45 },
    { id: 'lm-hospital', name: 'Hospital 28 de Agosto', type: 'hospital', districtId: 'map-adrianopolis', x: 61, y: 47 },
    { id: 'lm-court', name: 'Forum de Manaus', type: 'forum', districtId: 'map-centro', x: 52, y: 55 },
    { id: 'lm-police', name: 'Delegacia Central', type: 'delegacia', districtId: 'map-centro', x: 50, y: 57 },
    { id: 'lm-university', name: 'Universidade Federal do Amazonas', type: 'universidade', districtId: 'map-coroado', x: 78, y: 50 },
    { id: 'lm-ponta-negra', name: 'Orla da Ponta Negra', type: 'lazer', districtId: 'map-ponta-negra', x: 17, y: 46 },
    { id: 'lm-district-factory', name: 'Polo Industrial', type: 'industria', districtId: 'map-distrito-industrial', x: 76, y: 70 }
  ];

  const mapRoutes = [
    { id: 'route-centro-ponta-negra', from: 'map-centro', to: 'map-ponta-negra', type: 'arterial', distanceKm: 13.2, traffic: 66 },
    { id: 'route-centro-distrito', from: 'map-centro', to: 'map-distrito-industrial', type: 'logistics', distanceKm: 9.4, traffic: 72 },
    { id: 'route-centro-aeroporto', from: 'map-centro', to: 'map-aeroporto', type: 'express', distanceKm: 14.8, traffic: 57 },
    { id: 'route-vieiralves-adrianopolis', from: 'map-vieiralves', to: 'map-adrianopolis', type: 'urban', distanceKm: 2.1, traffic: 74 },
    { id: 'route-distrito-coroado', from: 'map-distrito-industrial', to: 'map-coroado', type: 'industrial', distanceKm: 6.7, traffic: 61 },
    { id: 'route-porto-educandos', from: 'map-porto', to: 'map-educandos', type: 'river-edge', distanceKm: 3.5, traffic: 59 }
  ];

  await upsertMany(companiesCollection, companies, 'id');
  await upsertMany(propertiesCollection, properties, 'id');
  await upsertMany(vehiclesCollection, vehicles, 'id');
  await upsertMany(inventoryCollection, inventoryItems, 'id');
  await upsertMany(missionsCollection, missions, 'id');
  await upsertMany(mapDistrictsCollection, mapDistricts, 'id');
  await upsertMany(mapLandmarksCollection, mapLandmarks, 'id');
  await upsertMany(mapRoutesCollection, mapRoutes, 'id');
  await upsertMany(servicesCollection, publicServices, 'id');
}

async function upsertMany(collection, records, key) {
  for (const record of records) {
    await collection.updateOne(
      { [key]: record[key] },
      { $setOnInsert: { ...record, createdAt: new Date() }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );
  }
}
