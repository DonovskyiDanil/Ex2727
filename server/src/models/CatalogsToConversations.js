module.exports = (sequelize, DataTypes) => {
  const CatalogsToConversations = sequelize.define('CatalogsToConversations', {
    catalogId: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      allowNull: false,
      field: 'catalogId',
      references: {
        model: 'Catalogs',
        key: 'id',
      },
    },
    conversationId: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      allowNull: false,
      field: 'conversationId',
      references: {
        model: 'Conversations',
        key: 'id',
      },
    },
  }, {
    tableName: 'CatalogsToConversations', 
    timestamps: false,
  });

  return CatalogsToConversations;
};
