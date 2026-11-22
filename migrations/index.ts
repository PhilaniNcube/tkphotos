import * as migration_20261121_151529_initial from './20261121_151529_initial';
import * as migration_20261122_103559 from './20261122_103559';
import * as migration_20261122_185415_add_services_collection from './20261122_185415_add_services_collection';

export const migrations = [
  {
    up: migration_20261121_151529_initial.up,
    down: migration_20261121_151529_initial.down,
    name: '20261121_151529_initial',
  },
  {
    up: migration_20261122_103559.up,
    down: migration_20261122_103559.down,
    name: '20261122_103559',
  },
  {
    up: migration_20261122_185415_add_services_collection.up,
    down: migration_20261122_185415_add_services_collection.down,
    name: '20261122_185415_add_services_collection'
  },
];
