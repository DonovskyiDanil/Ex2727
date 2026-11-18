module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Catalogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'userId', //
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      catalogName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'catalogName', //
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Catalogs');
  },
};
