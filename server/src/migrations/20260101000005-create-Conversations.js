module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      favoriteList: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'favoriteList', // Соответствие кавычкам в pgAdmin
      },
      blackList: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'blackList', //
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'createdAt', //
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Conversations');
  },
};
