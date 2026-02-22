module.exports = (sequelize, DataTypes) => {
  const ConversationParticipant = sequelize.define('ConversationParticipant', {
    conversationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'conversationId',
      references: {
        model: 'Conversations',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'userId',
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    tableName: 'ConversationParticipants', // Как в pgAdmin
    timestamps: false, // В SQL-скрипте нет полей времени
  });

  return ConversationParticipant;
};
