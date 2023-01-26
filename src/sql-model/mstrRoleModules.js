const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('mstrRoleModules', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mstrRoleId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'mstrRoles',
        key: 'id'
      }
    },
    mstrModuleId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'mstrModules',
        key: 'id'
      }
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'SYSTEM'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mstrRoleModules',
    schema: 'public',
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    indexes: [
      {
        name: 'mstrRoleModules_ALL',
        unique: true,
        fields: [
          { name: 'mstrRoleId' },
          { name: 'mstrModuleId' },
          { name: 'deletedAt' },
        ]
      },
      {
        name: 'mstrRoleModules_pkey',
        unique: true,
        fields: [
          { name: 'id' },
        ]
      },
    ]
  });
};
