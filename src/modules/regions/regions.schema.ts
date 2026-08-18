import type { FromSchema } from 'json-schema-to-ts';

export const regionIdParamSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer', minimum: 1 },
    },
    required: ['id'],
    additionalProperties: false,
} as const;


export const regionDetailQuerySchema = {
  type: 'object',
  properties: {
    include: { type: 'string', enum: ['countries'] },
  },
  additionalProperties: false,
} as const;

export const createRegionBodySchema = {
    type: 'object',
    properties: {
        region_name: { type: 'string', minLength: 1, maxLength: 25, pattern: '\\S' },
    },
    required: ['region_name'],
    additionalProperties: false,
} as const;

export const updateRegionBodySchema = {
    type: 'object',
    properties: {
        region_name: { type: 'string', minLength: 1, maxLength: 25, pattern: '\\S' },
    },
    minProperties: 1,
    additionalProperties: false,
} as const;

export const listRegionQuerySchema = {
    type: 'object',
    properties: {
        page: { type: 'integer', minimum: 1, default: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        search: { type: 'string', minLength: 1 },
    },
    additionalProperties: false,
} as const;

export type RegionIdParam = FromSchema<typeof regionIdParamSchema>;
export type CreateRegionInput = FromSchema<typeof createRegionBodySchema>;
export type UpdateRegionInput = FromSchema<typeof updateRegionBodySchema>;
export type ListRegionQuery = FromSchema<typeof listRegionQuerySchema> &
    Required<Pick<FromSchema<typeof listRegionQuerySchema>, 'page' | 'limit'>>;
//include countries
export type RegionDetailQuery = FromSchema<typeof regionDetailQuerySchema>;