module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Messages', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Messages', // Строго как в pgAdmin
    timestamps: false,     // У нас нет updatedAt в SQL-скрипте
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
    Message.belongsTo(models.User, { foreignKey: 'sender' });
  };

  return Message;
};
