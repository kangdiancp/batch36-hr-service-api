import type { FastifyPluginAsync } from 'fastify';
import { regionRoutes } from '../modules/regions/regions.routes';


export const apiRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(regionRoutes, { prefix: '/regions' });
};
