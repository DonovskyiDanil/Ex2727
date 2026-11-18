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
<<<<<<< HEAD
  }, {
    tableName: 'CatalogsToConversations', // Строго как в pgAdmin
    timestamps: false,
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  });

  return CatalogsToConversations;
};
