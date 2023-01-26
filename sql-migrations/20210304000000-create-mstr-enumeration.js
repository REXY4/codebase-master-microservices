module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable(
        'mstrEnumerations',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          key: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true
          },
          value: {
            allowNull: false,
            type: Sequelize.TEXT
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
        {
          transaction,
          comment: 'Global configuration'
        }
      )
      await queryInterface.addIndex('mstrEnumerations', ['key', 'deletedAt'], {
        name: 'mstrEnumerations_ALL',
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
    await queryInterface.dropTable('mstrEnumerations')
  }
}
