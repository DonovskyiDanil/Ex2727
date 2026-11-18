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
<<<<<<< HEAD
    favoriteList: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    blackList: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'ConversationParticipants', // Как в pgAdmin
    timestamps: false,
=======
  }, {
    tableName: 'ConversationParticipants', // Как в pgAdmin
    timestamps: false, // В SQL-скрипте нет полей времени
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  });

  return ConversationParticipant;
};
