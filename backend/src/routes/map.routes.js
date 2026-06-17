import { Router } from 'express';
import { listCollection } from '../repositories/core.repository.js';

export const mapRouter = Router();

mapRouter.get('/', async (_request, response, next) => {
  try {
    const [districts, landmarks, routes] = await Promise.all([
      listCollection('map_districts', { name: 1 }),
      listCollection('map_landmarks', { type: 1, name: 1 }),
      listCollection('map_routes', { type: 1 })
    ]);

    response.json({
      map: {
        name: 'Manaus MVP Logical Map',
        scale: 'prototype_2d',
        source: 'manual_mvp_layout_pending_gis_pipeline',
        districts,
        landmarks,
        routes
      }
    });
  } catch (error) {
    next(error);
  }
});
