module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRewards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING(40),
      },
      reference: {
        allowNull: false,
        type: Sequelize.STRING(80),
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addConstraint('UserRewards', {
      fields: ['userId', 'type', 'reference'],
      type: 'unique',
      name: 'UserRewards_user_type_reference_unique',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('UserRewards');
  },
};
