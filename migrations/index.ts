import * as migration_20261121_151529_initial from './20261121_151529_initial';
import * as migration_20261122_103559 from './20261122_103559';
import * as migration_20261122_185415_add_services_collection from './20261122_185415_add_services_collection';
import * as migration_20261122_194827_add_service_featured_image from './20261122_194827_add_service_featured_image';
import * as migration_20261123_074100_add_user_roles from './20261123_074100_add_user_roles';

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
    name: '20261122_185415_add_services_collection',
  },
  {
    up: migration_20261122_194827_add_service_featured_image.up,
    down: migration_20261122_194827_add_service_featured_image.down,
    name: '20261122_194827_add_service_featured_image',
  },
  {
    up: migration_20261123_074100_add_user_roles.up,
    down: migration_20261123_074100_add_user_roles.down,
    name: '20261123_074100_add_user_roles'
  },
];
