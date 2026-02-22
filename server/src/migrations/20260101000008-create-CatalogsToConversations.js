module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CatalogsToConversations', {
      catalogId: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Составной ключ
        field: 'catalogId',
        references: { model: 'Catalogs', key: 'id' },
        onDelete: 'CASCADE',
      },
      conversationId: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Составной ключ
        field: 'conversationId',
        references: { model: 'Conversations', key: 'id' },
        onDelete: 'CASCADE',
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('CatalogsToConversations');
  },
};
