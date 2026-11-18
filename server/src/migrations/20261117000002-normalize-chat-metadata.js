module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ConversationParticipants', 'favoriteList', {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn('ConversationParticipants', 'blackList', {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn('Conversations', 'updatedAt', {
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('Messages', 'updatedAt', {
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      type: Sequelize.DATE,
    });
    await queryInterface.sequelize.query(
      `UPDATE "ConversationParticipants" p
          SET "favoriteList" = COALESCE(c."favoriteList", FALSE),
              "blackList" = COALESCE(c."blackList", FALSE)
         FROM "Conversations" c
        WHERE c.id = p."conversationId"`,
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Messages', 'updatedAt');
    await queryInterface.removeColumn('Conversations', 'updatedAt');
    await queryInterface.removeColumn('ConversationParticipants', 'blackList');
    await queryInterface.removeColumn('ConversationParticipants', 'favoriteList');
  },
};
