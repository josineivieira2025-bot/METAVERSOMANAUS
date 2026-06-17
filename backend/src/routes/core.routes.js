import { Router } from 'express';
import { createRecord, listCollection, updateRecord } from '../repositories/core.repository.js';

const modules = {
  companies: { collection: 'companies', prefix: 'company', sort: { tradeName: 1 } },
  properties: { collection: 'properties', prefix: 'property', sort: { district: 1 } },
  vehicles: { collection: 'vehicles', prefix: 'vehicle', sort: { type: 1 } },
  inventory: { collection: 'inventory_items', prefix: 'item', sort: { name: 1 } },
  missions: { collection: 'missions', prefix: 'mission', sort: { district: 1 } },
  services: { collection: 'public_services', prefix: 'service', sort: { type: 1 } },
  moderation: { collection: 'moderation_reports', prefix: 'report', sort: { createdAt: -1 } }
};

export function createCoreRouter(moduleName) {
  const settings = modules[moduleName];
  const router = Router();

  router.get('/', async (_request, response, next) => {
    try {
      response.json({ [moduleName]: await listCollection(settings.collection, settings.sort) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      response.status(201).json({
        [singular(moduleName)]: await createRecord(settings.collection, settings.prefix, request.body)
      });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id', async (request, response, next) => {
    try {
      response.json({
        [singular(moduleName)]: await updateRecord(settings.collection, request.params.id, request.body)
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function singular(moduleName) {
  return {
    companies: 'company',
    properties: 'property',
    vehicles: 'vehicle',
    inventory: 'item',
    missions: 'mission',
    services: 'service',
    moderation: 'report'
  }[moduleName];
}
