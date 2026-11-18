module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
<<<<<<< HEAD
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
=======
    favoriteList: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blackList: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Conversations',
<<<<<<< HEAD
    timestamps: false,
  });

=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

  return Conversation;
};
