module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    favoriteList: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blackList: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Conversations',
    timestamps: false, // В SQL нет updatedAt, поэтому отключаем автоматику
  });

  Conversation.associate = (models) => {
    Conversation.hasMany(models.Message, { foreignKey: 'conversationId' });
    Conversation.belongsToMany(models.User, {
      through: models.ConversationParticipant,
      foreignKey: 'conversationId',
      otherKey: 'userId',
    });
    Conversation.belongsToMany(models.Catalog, {
      through: models.CatalogsToConversations,
      foreignKey: 'conversationId',
      otherKey: 'catalogId',
    });
  };

  return Conversation;
};
