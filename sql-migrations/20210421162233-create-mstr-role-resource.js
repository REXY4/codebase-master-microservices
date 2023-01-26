module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable(
        'mstrRoleResources',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          mstrRoleId: {
            type: Sequelize.SMALLINT,
            references: {
              model: 'mstrRoles',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
          },
          mstrResourceId: {
            type: Sequelize.SMALLINT,
            references: {
              model: 'mstrResources',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
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
      await queryInterface.addIndex('mstrRoleResources', ['mstrRoleId', 'mstrResourceId', 'deletedAt'], {
        name: 'mstrRoleResources_ALL',
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
    await queryInterface.dropTable('mstrRoleResources')
  }
}
