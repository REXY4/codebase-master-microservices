const { DataTypes } = require('sequelize');
const _mstrEnumerations = require('./mstrEnumerations');
const _mstrModules = require('./mstrModules');
const _mstrResources = require('./mstrResources');
const _mstrRoleModules = require('./mstrRoleModules');
const _mstrRoleResources = require('./mstrRoleResources');
const _mstrRoles = require('./mstrRoles');

function initModels(sequelize) {
  const mstrEnumerations = _mstrEnumerations(sequelize, DataTypes);
  const mstrModules = _mstrModules(sequelize, DataTypes);
  const mstrResources = _mstrResources(sequelize, DataTypes);
  const mstrRoleModules = _mstrRoleModules(sequelize, DataTypes);
  const mstrRoleResources = _mstrRoleResources(sequelize, DataTypes);
  const mstrRoles = _mstrRoles(sequelize, DataTypes);

  mstrRoleModules.belongsTo(mstrModules, { as: 'mstrModule', foreignKey: 'mstrModuleId' });
  mstrModules.hasMany(mstrRoleModules, { as: 'mstrRoleModules', foreignKey: 'mstrModuleId' });
  mstrRoleResources.belongsTo(mstrResources, { as: 'mstrResource', foreignKey: 'mstrResourceId' });
  mstrResources.hasMany(mstrRoleResources, { as: 'mstrRoleResources', foreignKey: 'mstrResourceId' });
  mstrRoleModules.belongsTo(mstrRoles, { as: 'mstrRole', foreignKey: 'mstrRoleId' });
  mstrRoles.hasMany(mstrRoleModules, { as: 'mstrRoleModules', foreignKey: 'mstrRoleId' });
  mstrRoleResources.belongsTo(mstrRoles, { as: 'mstrRole', foreignKey: 'mstrRoleId' });
  mstrRoles.hasMany(mstrRoleResources, { as: 'mstrRoleResources', foreignKey: 'mstrRoleId' });

  return {
    mstrEnumerations,
    mstrModules,
    mstrResources,
    mstrRoleModules,
    mstrRoleResources,
    mstrRoles,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
