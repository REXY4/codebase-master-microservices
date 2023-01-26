const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('mstrRoleResources', {
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
    mstrResourceId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'mstrResources',
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
    tableName: 'mstrRoleResources',
    schema: 'public',
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    indexes: [
      {
        name: 'mstrRoleResources_ALL',
        unique: true,
        fields: [
          { name: 'mstrRoleId' },
          { name: 'mstrResourceId' },
          { name: 'deletedAt' },
        ]
      },
      {
        name: 'mstrRoleResources_pkey',
        unique: true,
        fields: [
          { name: 'id' },
        ]
      },
    ]
  });
};
