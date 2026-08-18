import type { FastifyPluginAsync } from 'fastify';
import * as regionController from './regions.controller';
import {
    createRegionBodySchema,
    listRegionQuerySchema,
    regionDetailQuerySchema,
    regionIdParamSchema,
    updateRegionBodySchema,
} from './regions.schema';

export const regionRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        '/',
        { schema: { querystring: listRegionQuerySchema } },
        regionController.listRegions,
    );

    /* fastify.get(
        '/:id',
        { schema: { params: regionIdParamSchema } },
        regionController.getRegion,
    ); */

    fastify.post(
        '/',
        { schema: { body: createRegionBodySchema } },
        regionController.createRegion,
    );

    fastify.patch(
        '/:id',
        { schema: { params: regionIdParamSchema, body: updateRegionBodySchema } },
        regionController.updateRegion,
    );

    fastify.delete(
        '/:id',
        { schema: { params: regionIdParamSchema } },
        regionController.deleteRegion,
    );

    fastify.get(
        '/:id',
        { schema: { params: regionIdParamSchema, querystring: regionDetailQuerySchema } },
        regionController.getRegionCountry,
    );
};