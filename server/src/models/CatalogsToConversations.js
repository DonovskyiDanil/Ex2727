module.exports = (sequelize, DataTypes) => {
  const CatalogsToConversations = sequelize.define('CatalogsToConversations', {
    catalogId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Составной ключ из SQL
      allowNull: false,
      field: 'catalogId',
      references: {
        model: 'Catalogs',
        key: 'id',
      },
    },
    conversationId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Составной ключ из SQL
      allowNull: false,
      field: 'conversationId',
      references: {
        model: 'Conversations',
        key: 'id',
      },
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
    tableName: 'CatalogsToConversations', // Строго как в pgAdmin
    timestamps: true,
  });

  return CatalogsToConversations;
};
