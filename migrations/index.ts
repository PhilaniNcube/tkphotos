import * as migration_20261121_151529_initial from './20261121_151529_initial';

export const migrations = [
  {
    up: migration_20261121_151529_initial.up,
    down: migration_20261121_151529_initial.down,
    name: '20261121_151529_initial'
  },
];
