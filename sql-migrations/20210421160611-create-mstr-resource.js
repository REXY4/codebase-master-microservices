module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable(
        'mstrResources',
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
          isInternalDefault: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          isExternalDefault: {
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
      await queryInterface.addIndex('mstrResources', ['code', 'deletedAt'], {
        name: 'mstrResources_code',
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
    await queryInterface.dropTable('mstrResources')
  }
}
