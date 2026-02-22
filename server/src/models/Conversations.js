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
      field: 'favoriteList', // Соответствие кавычкам в SQL
    },
    blackList: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'blackList', // Соответствие кавычкам в SQL
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'createdAt',
    },
  }, {
    tableName: 'Conversations',
    timestamps: false, // В SQL нет updatedAt, поэтому отключаем автоматику
  });

  Conversation.associate = (models) => {
    // Сообщения привязаны к чату
    Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'messages' });
    // Участники чата (связь многие-ко-многим через созданную ранее модель)
    Conversation.belongsToMany(models.User, {
      through: models.ConversationParticipant,
      foreignKey: 'conversationId',
      otherKey: 'userId',
      as: 'participants',
    });

    // Связь с каталогами
    Conversation.belongsToMany(models.Catalog, {
      through: models.CatalogsToConversations,
      foreignKey: 'conversationId',
      otherKey: 'catalogId',
      as: 'catalogs',
    });
  };

  return Conversation;
};
