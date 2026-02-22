module.exports = (sequelize, DataTypes) => {
  const Catalog = sequelize.define('Catalogs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'userId', // Соответствие "userId" в SQL
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    catalogName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'catalogName', // Соответствие "catalogName" в SQL
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'createdAt',
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updatedAt',
    },
  }, {
    tableName: 'Catalogs', // Явное имя таблицы
    timestamps: true, // Включаем, так как в SQL они есть
  });

  Catalog.associate = (models) => {
    Catalog.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
    Catalog.belongsToMany(models.Conversation, {
      through: 'CatalogsToConversations',
      foreignKey: 'catalogId',
      otherKey: 'conversationId',
      as: 'chats',
    });
  };

  return Catalog;
};
