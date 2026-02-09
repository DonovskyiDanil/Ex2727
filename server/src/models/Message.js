module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Conversation, { foreignKey: 'conversationId', as: 'conversation' });
    Message.belongsTo(models.User, { foreignKey: 'sender', as: 'senderUser' });
  };

  return Message;
};
