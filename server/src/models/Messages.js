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
    conversation: { // В SQL поле называется именно так
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
      field: 'createdAt', // Соответствие кавычкам в SQL
    },
  }, {
    tableName: 'Messages', // Строго как в pgAdmin
    timestamps: false,     // У нас нет updatedAt в SQL-скрипте
  });

  Message.associate = (models) => {
    // Указываем foreignKey именно 'conversation', как в базе
    Message.belongsTo(models.Conversation, { foreignKey: 'conversation', as: 'conversationData' });
    Message.belongsTo(models.User, { foreignKey: 'sender', as: 'senderUser' });
  };

  return Message;
};
