import type { regions } from '../../db/schema';

export type RegionRow = typeof regions.$inferSelect;
export type NewRegionRow = typeof regions.$inferInsert;

// gambaran tanpa inferSelect
/* interface RegionRows{
    regionId : number;
    regionName : string;
}

interface NewRegionRows{
    regionName : string;
}

interface Employee{
    empId : number;
} */