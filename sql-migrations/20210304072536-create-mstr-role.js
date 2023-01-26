module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable(
        'mstrRoles',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.SMALLINT
          },
          code: {
            allowNull: false,
            type: Sequelize.STRING(50)
          },
          name: {
            allowNull: false,
            type: Sequelize.STRING
          },
          isInternal: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          isDefault: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          createdBy: {
            allowNull: false,
            type: Sequelize.STRING(50),
            defaultValue: 'SYSTEM'
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedBy: {
            type: Sequelize.STRING(50)
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          deletedBy: {
            type: Sequelize.STRING(50)
          },
          deletedAt: {
            type: Sequelize.DATE
          },
          notes: {
            type: Sequelize.STRING
          }
        },
        { transaction }
      )
      await queryInterface.addIndex('mstrRoles', ['code', 'deletedAt'], {
        name: 'mstrRoles_code',
        indicesType: 'UNIQUE',
        transaction,
        unique: true
      })
      await queryInterface.addIndex('mstrRoles', ['name', 'deletedAt'], {
        name: 'mstrRoles_name',
        indicesType: 'UNIQUE',
        transaction,
        unique: true
      })
      await queryInterface.addIndex('mstrRoles', ['code', 'name', 'deletedAt'], {
        name: 'mstrRoles_ALL',
        indicesType: 'UNIQUE',
        transaction,
        unique: true
      })
      await transaction.commit()
    } catch (err) {
      if (transaction.connection.inTransaction) await transaction.rollback()
      throw err
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mstrRoles')
  }
}
