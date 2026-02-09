module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    participant1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participant2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blackList: {
      type: DataTypes.ARRAY(DataTypes.BOOLEAN),
      defaultValue: [false, false],
    },
    favoriteList: {
      type: DataTypes.ARRAY(DataTypes.BOOLEAN),
      defaultValue: [false, false],
    },
  });

  Conversation.associate = (models) => {
    Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'messages' });
    Conversation.belongsTo(models.User, { foreignKey: 'participant1', as: 'user1' });
    Conversation.belongsTo(models.User, { foreignKey: 'participant2', as: 'user2' });
  };

  return Conversation;
};
