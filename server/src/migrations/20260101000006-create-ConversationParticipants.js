module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ConversationParticipants', {
      conversationId: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Составной ключ
        field: 'conversationId',
        references: { model: 'Conversations', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Составной ключ
        field: 'userId',
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('ConversationParticipants');
  },
};
